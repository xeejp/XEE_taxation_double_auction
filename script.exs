defmodule DoubleAuctionElixir do
  use Xee.ThemeScript
  require Logger

  use Timex

  @modes ["wait", "description", "auction", "result"]

  # Callbacks
  def script_type do
    :message
  end

  def install, do: nil

  def init do
    {:ok, %{"data" => %{
       mode: "wait",
       participants: %{},
       buyer_bids: [],
       highest_bid: nil,
       seller_bids: [],
       lowest_bid: nil,
       deals: [],
       started: false,
       price_base: 100
     }}}
  end

  def join(%{participants: participants} = data, id) do
    if not Map.has_key?(participants, id) do
      participant = %{role: nil, bidded: false, money: nil, bid: nil, dealt: false}
      participants = Map.put(participants, id, participant)
      data = %{data | participants: participants}
      action = %{
        type: "ADD_USER",
        id: id,
        user: participant
      }
      {:ok, %{"data" => data, "host" => %{action: action}}}
    else
      {:ok, %{"data" => data}}
    end
  end

  def handle_received(data, %{"action" => "start"}) do
    {:ok, %{"data" => %{data | started: true}}}
  end

  def handle_received(data, %{"action" => "stop"}) do
    {:ok, %{"data" => %{data | started: false}}}
  end

  def handle_received(data, %{"action" => "change_mode", "params" => mode}) do
    action = %{
      type: "CHANGE_MODE",
      payload: mode
    }
    data = %{data | mode: mode}
    {_, participant} = dispatch_to_all(data.participants, action)
    {:ok, %{"data" => data, "host" => %{action: action}, "participant" => participant}}
  end

  def handle_received(data, %{"action" => "match"}) do
    participants = Enum.shuffle(data.participants) |> Enum.map_reduce(1, fn {id, participant}, acc ->
      if rem(acc, 2) == 0 do
        new_participant = %{
          role: "buyer",
          money: acc * data.price_base,
          bidded: false,
          bid: nil,
          dealt: false,
        }
      else
        new_participant = %{
          role: "seller",
          money: acc * data.price_base,
          bidded: false,
          bid: nil,
          dealt: false,
        }
      end
      {{id, new_participant}, acc + 1}
    end) |> elem(0) |> Enum.into(%{})

    host_action = %{action: %{
      type: "UPDATE_USERS",
      users: participants
    }}
    participant_actions = Enum.map(participants, fn {id, personal} ->
      {id, %{action: %{
         type: "UPDATE_PERSONAL",
         personal: personal
       }}}
    end) |> Enum.into(%{})


    data = %{data | participants: participants,
     buyer_bids: [], seller_bids: [], deals: [],
     highest_bid: nil, lowest_bid: nil }
    {:ok, %{"data" => data, "host" => host_action, "participant" => participant_actions}}
  end

  def mapelem(list, i) do
    Enum.map(list, &(elem(&1, i)))
  end

  def handle_received(data, %{"action" => "fetch_contents"}) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: %{
        mode: data.mode,
        users: data.participants,
        buyerBids: mapelem(data.buyer_bids, 1),
        sellerBids: mapelem(data.seller_bids, 1),
        deals: mapelem(data.deals, 0)
      }
    }
    {:ok, %{"data" => data, "host" => %{action: action}}}
  end

  def handle_received(data, %{"action" => "fetch_contents"}, id) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: %{
        mode: data.mode,
        buyerBids: mapelem(data.buyer_bids, 1),
        sellerBids: mapelem(data.seller_bids, 1),
        deals: mapelem(data.deals, 0),
        personal: Map.get(data.participants, id)
      }
    }
    {:ok, %{"data" => data, "participant" => %{id => %{action: action}}}}
  end

  def dealt(data, id1, id2, money) do
    data
    |> update_in([:participants, id1], fn participant ->
          %{participant | bidded: false, dealt: true, bid: money}
    end)
    |> update_in([:participants, id2], fn participant ->
          %{participant | bidded: false, dealt: true, bid: money}
    end)
  end

  def handle_received(data, %{"action" => "bid", "params" => bid}, id) do
    participant = Map.get(data.participants, id)
    participant_actions = %{}
    host_action = nil

    case participant do
      # Seller
      %{role: "seller", bidded: bidded, bid: previous_bid, money: money} when not is_nil(money) and bid >= money ->
        if previous_bid != nil do
          data = %{data | seller_bids: List.delete(data.seller_bids, {id, previous_bid})}
        end
        if not is_nil(data.highest_bid) and bid <= elem(data.highest_bid, 1) do
          now = DateTime.today
          buyer_id = elem(data.highest_bid, 0)
          deals = [{bid, now, {id, buyer_id}} | data.deals]
          buyer_bids = List.delete(data.buyer_bids, data.highest_bid)
          data = %{data | deals: deals, buyer_bids: buyer_bids}
          data = dealt(data, id, buyer_id, bid)

          host_action = %{
            type: "DEALT",
            sellerID: id, buyerID: buyer_id, time: now,
            money: bid, money2: elem(data.highest_bid, 1), previousBid: previous_bid
          }
          participant_actions = Enum.map(data.participants, fn {p_id, _} ->
            if p_id == id or p_id == buyer_id do
              {p_id, %{
                action: %{
                  type: "DEALT",
                  money: bid,
                  money2: elem(data.highest_bid, 1),
                  previousBid: previous_bid
                }
              }}
            else
              {p_id, %{
                action: %{
                  type: "SOMEONE_DEALT",
                  money: bid,
                  money2: elem(data.highest_bid, 1),
                  previousBid: previous_bid
                }
              }}
            end
          end) |> Enum.into(%{})
        else
          seller_bids = [{id, bid} | data.seller_bids]
          if is_nil(data.lowest_bid) or bid < elem(data.lowest_bid, 1) do
            lowest_bid = {id, bid}
          end
          data = %{data | seller_bids: seller_bids, lowest_bid: lowest_bid}
          data = update_in(data, [:participants, id], fn participant ->
            %{participant | bidded: true, bid: bid}
          end)
          host_action = %{
            type: "NEW_SELLER_BIDS",
            money: bid,
            previousBid: previous_bid,
            id: id
          }
          participant_actions = Enum.map(data.participants, fn {p_id, _} ->
            {p_id, %{
              action: %{
                type: "NEW_SELLER_BIDS",
                money: bid,
                previousBid: previous_bid
              }
            }}
          end) |> Enum.into(%{})
        end
      # Buyer
      %{role: "buyer", bidded: bidded, bid: previous_bid, money: money} when not is_nil(money) and bid <= money ->
        if previous_bid != nil do
          data = %{data | buyer_bids: List.delete(data.buyer_bids, {id, previous_bid})}
        end
        if not is_nil(data.lowest_bid) and bid >= elem(data.lowest_bid, 1) do
          now = DateTime.today()
          seller_id = elem(data.lowest_bid, 0)
          deals = [{bid, DateTime.today(), {id, seller_id}} | data.deals]
          seller_bids = List.delete(data.seller_bids, data.lowest_bid)
          data = %{data | deals: deals, seller_bids: seller_bids}
          data = dealt(data, id, seller_id, bid)

          host_action = %{
            type: "DEALT",
            sellerID: seller_id, buyerID: id,
            time: now, money: bid, money2: elem(data.lowest_bid, 1), previousBid: previous_bid
          }
          participant_actions = Enum.map(data.participants, fn {p_id, _} ->
            if p_id == seller_id or p_id == id do
              {p_id, %{
                action: %{
                  type: "DEALT",
                  money: bid,
                  money2: elem(data.lowest_bid, 1),
                  previousBid: previous_bid
                }
              }}
            else
              {p_id, %{
                action: %{
                  type: "SOMEONE_DEALT",
                  money: bid,
                  money2: elem(data.lowest_bid, 1),
                  previousBid: previous_bid
                }
              }}
            end
          end) |> Enum.into(%{})
        else
          buyer_bids = [{id, bid} | data.buyer_bids]
          if is_nil(data.highest_bid) or  bid > elem(data.highest_bid, 1) do
            highest_bid = {id, bid}
          end
          data = %{data | buyer_bids: buyer_bids, highest_bid: highest_bid}
          data = update_in(data, [:participants, id], fn participant ->
            %{participant | bidded: true, bid: bid}
          end)
          host_action = %{
            type: "NEW_BUYER_BIDS",
            money: bid,
            previousBid: previous_bid,
            id: id
          }
          participant_actions = Enum.map(data.participants, fn {p_id, _} ->
            {p_id, %{
              action: %{
                type: "NEW_BUYER_BIDS",
                money: bid,
                previousBid: previous_bid
              }
            }}
          end) |> Enum.into(%{})
        end
    end

    if not is_nil(host_action) do
      {:ok, %{"data" => data, "host" => %{action: host_action}, "participant" => participant_actions}}
    else
      {:ok, %{"data" => data, "participant" => participant_actions}}
    end
  end

  def dispatch_to_all(participants, action) do
    host = %{action: action}
    participant = Enum.map(participants, fn {id, _} -> {id, %{action: action}} end)
                  |> Enum.into(%{})
    {host, participant}
  end
end

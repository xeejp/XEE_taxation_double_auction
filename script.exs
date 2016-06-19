defmodule ChickenRace do
  use Xee.ThemeScript
  require Logger

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

  def handle_received(data, %{"action" => "fetch_contents"}) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: %{
        mode: data.mode,
        users: data.participants,
        buyerBids: data.buyer_bids,
        sellerBids: data.seller_bids,
        deals: data.deals
      }
    }
    {:ok, %{"data" => data, "host" => %{action: action}}}
  end

  def handle_received(data, %{"action" => "fetch_contents"}, id) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: %{
        mode: data.mode,
        buyerBids: data.buyer_bids,
        sellerBids: data.seller_bids,
        deals: data.deals,
        personal: Map.get(data.participants, id)
      }
    }
    {:ok, %{"data" => data, "participant" => %{id => %{action: action}}}}
  end

  def dealt(data, id1, id2) do
    data
    |> update_in([:participants, id1], fn participant ->
          %{participant | bidded: false, dealt: true, bid: nil}
    end)
    |> update_in([:participants, id2], fn participant ->
          %{participant | bidded: false, dealt: true, bid: nil}
    end)
  end

  def handle_received(%{participants: participants, buyer_bids: buyer_bids, seller_bids: seller_bids, deals: deals, highest_bid: highest_bid, lowest_bid: lowest_bid} = data, %{"action" => "bid", "params" => bid}, id) do
    participant = Map.get(participants, id)
    participant_actions = %{}
    host_action = nil

    case participant do
      # Seller
      %{role: :seller, bidded: false, money: money} when not is_nil(money) ->
        if not is_nil(highest_bid) and bid <= elem(highest_bid, 1) do
          now = DateTime.today()
          buyer_id = elem(highest_bid, 0)
          deals = [{bid, now, {id, buyer_id}} | deals]
          participants = participants
                        |> Map.update!(id, &(Map.put(&1, :dealt, true)))
                        |> Map.update!(buyer_id, &(Map.put(&1, :dealt, true)))
          buyer_bids = List.delete(buyer_bids, highest_bid)
          data = %{data | deals: deals, participants: participants, buyer_bids: buyer_bids}
          data = dealt(data, id, buyer_id)

          host_action = %{
            type: "DEALT",
            sellerID: id, buyerID: buyer_id, time: now, money: bid
          }
          participant_actions = Enum.map(participants, fn {p_id, _} ->
            if p_id == id or p_id == buyer_id do
              {id, %{
                action: %{
                  type: "DEALT",
                  money: bid
                }
              }}
            else
              {id, %{
                action: %{
                  type: "SOMEONE_DEALT",
                  money: bid
                }
              }}
            end
          end) |> Enum.into(%{})
        else
          seller_bids = [{id, bid} | seller_bids]
          if is_nil(lowest_bid) or bid < elem(lowest_bid, 1) do
            lowest_bid = {id, bid}
          end
          data = %{data | seller_bids: seller_bids, lowest_bid: lowest_bid}
          data = update_in(data, [:participant, id], fn participant ->
            %{participant | bidded: true, bid: bid}
          end)
          host_action = %{
            type: "NEW_SELLER_BIDS",
            money: bid
          }
          participant_actions = Enum.map(participants, fn {p_id, _} ->
            unless p_id == id do
              {id, %{
                action: %{
                  type: "NEW_SELLER_BIDS",
                  money: bid
                }
              }}
            end
          end) |> Enum.into(%{})
        end
      # Buyer
      %{role: :buyer, bidded: false, money: money} when not is_nil(money) ->
        if not is_nil(lowest_bid) and bid >= elem(lowest_bid, 1) do
          now = DateTime.today()
          seller_id = elem(lowest_bid, 0)
          deals = [{bid, DateTime.today(), {id, seller_id}} | deals]
          participants = participants
                        |> Map.update!(id, &(Map.put(&1, :dealt, true)))
                        |> Map.update!(seller_id, &(Map.put(&1, :dealt, true)))
          seller_bids = List.delete(seller_bids, lowest_bid)
          data = %{data | deals: deals, participants: participants, seller_bids: seller_bids}
          data = dealt(data, id, seller_id)

          host_action = %{
            type: "DEALT",
            sellerID: seller_id, buyerID: id, time: now, money: bid
          }
          participant_actions = Enum.map(participants, fn {p_id, _} ->
            if p_id == seller_id or p_id == id do
              {id, %{
                action: %{
                  type: "DEALT",
                  money: bid
                }
              }}
            else
              {id, %{
                action: %{
                  type: "SOMEONE_DEALT",
                  money: bid
                }
              }}
            end
          end) |> Enum.into(%{})
        else
          buyer_bids = [{id, bid} | buyer_bids]
          if is_nil(highest_bid) or  bid > elem(highest_bid, 1) do
            highest_bid = {id, bid}
          end
          data = %{data | buyer_bids: buyer_bids, highest_bid: highest_bid}
          data = update_in(data, [:participant, id], fn participant ->
            %{participant | bidded: true, bid: bid}
          end)
          host_action = %{
            type: "NEW_BUYER_BIDS",
            money: bid
          }
          participant_actions = Enum.map(participants, fn {p_id, _} ->
            unless p_id == id do
              {id, %{
                action: %{
                  type: "NEW_BUYER_BIDS",
                  money: bid
                }
              }}
            end
          end) |> Enum.into(%{})
        end
    end

    if not is_nil(host_action) do
      {:ok, %{"data" => data, "host" => %{action: host_action}, "participant" => participant_actions}}
    else
      {:ok, %{"data" => data, "participant" => participant_actions}}
    end
  end
end

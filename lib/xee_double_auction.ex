defmodule DoubleAuction do
  use XeeThemeScript
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
      participant = %{role: nil, bidded: false, money: nil, bid: nil, dealt: false, deal: nil}
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

  def dealt(data, id1, id2, money) do
    data
    |> update_in([:participants, id1], fn participant ->
          %{participant | bidded: false, bid: money, dealt: true, deal: money}
    end)
    |> update_in([:participants, id2], fn participant ->
          %{participant | bidded: false, dealt: true, deal: money}
    end)
  end

  def set_highest_bid(%{buyer_bids: []} = data) do
    %{ data | highest_bid: nil }
  end
  def set_highest_bid(%{buyer_bids: bids} = data) do
    %{ data | highest_bid: Enum.max_by(bids, &elem(&1, 1)) }
  end

  def set_lowest_bid(%{seller_bids: []} = data) do
    %{ data | lowest_bid: nil }
  end
  def set_lowest_bid(%{seller_bids: bids} = data) do
    %{ data | lowest_bid: Enum.min_by(bids, &elem(&1, 1)) }
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
          deal: nil
        }
      else
        new_participant = %{
          role: "seller",
          money: acc * data.price_base,
          bidded: false,
          bid: nil,
          dealt: false,
          deal: nil
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

  def handle_received(data, %{"action" => "bid", "params" => bid}, id) do
    participant = Map.get(data.participants, id)
    {data, host_action, participant_actions} = case participant do
      # Seller
      %{role: "seller", bidded: bidded, bid: previous_bid, money: money, dealt: false} when not is_nil(money) and bid >= money ->
        data = remove_first(data, id, previous_bid, :lowest_bid, :seller_bids, &set_lowest_bid/1)
        if not is_nil(data.highest_bid) and bid <= elem(data.highest_bid, 1) do
          deal(data, :highest_bid, :buyer_bids, id, bid, previous_bid, &set_highest_bid/1)
        else
          bid(data, :lowest_bid, :seller_bids, id, bid, previous_bid, "NEW_SELLER_BIDS")
        end
      # Buyer
      %{role: "buyer", bidded: bidded, bid: previous_bid, money: money, dealt: false} when not is_nil(money) and bid <= money ->
        data = remove_first(data, id, previous_bid, :highest_bid, :buyer_bids, &set_highest_bid/1)
        if not is_nil(data.lowest_bid) and bid >= elem(data.lowest_bid, 1) do
          deal(data, :lowest_bid, :seller_bids, id, bid, previous_bid, &set_lowest_bid/1)
        else
          bid(data, :highest_bid, :buyer_bids, id, bid, previous_bid, "NEW_BUYER_BIDS")
        end
    end

    if not is_nil(host_action) do
      {:ok, %{"data" => data, "host" => %{action: host_action}, "participant" => participant_actions}}
    else
      {:ok, %{"data" => data, "participant" => participant_actions}}
    end
  end

  def remove_first(data, id, previous_bid, bid_key, key, set) do
    if previous_bid != nil do
      data = %{data | key => List.delete(data[key], {id, previous_bid})}
      if not is_nil(data[bid_key]) and elem(data[bid_key], 0) == id do
        data = set.(data)
      end
    end
    data
  end

  def bid(data, bid_key, key, id, bid, previous_bid, action) do
    bids = [{id, bid} | data[key]]
    most_bid = if is_nil(data[bid_key]) or bid > elem(data[bid_key], 1) do
      {id, bid}
    else
      data[bid_key]
    end
    data = %{data | key => bids, bid_key => most_bid}
    data = update_in(data, [:participants, id], fn participant ->
      %{participant | bidded: true, bid: bid}
    end)
    host_action = %{ type: action, money: bid, previousBid: previous_bid, id: id }
    participant_actions = bid_action_for_participants(data.participants, id, bid, previous_bid, action)
    {data, host_action, participant_actions}
  end

  def deal(data, bid_key, partner_key, id, bid, previous_bid, set) do
    now = DateTime.today()
    id2 = elem(data[bid_key], 0)
    deals = [new_deal(bid, id, id2, now) | data.deals]
    bids = List.delete(data[partner_key], data[bid_key])
    data = %{data | :deals => deals, partner_key => bids}
    data = dealt(data, id, id2, bid)

    host_action = %{
      type: "DEALT",
      id1: id, id2: id2, time: now,
      money: bid, money2: elem(data[bid_key], 1), previousBid: previous_bid
    }
    participant_actions = Enum.map(data.participants, fn {p_id, _} ->
      deal_or_dealt_action(p_id, id, id2, bid, elem(data[bid_key], 1), previous_bid)
    end) |> Enum.into(%{})
    data = set.(data)
    {data, host_action, participant_actions}
  end

  def bid_action_for_participants(participants, id, bid, previous_bid, action) do
    Enum.map(participants, fn {p_id, _} ->
      {p_id, %{
        action: %{
          bidded: p_id == id,
          type: action,
          money: bid,
          previousBid: previous_bid
        }
      }}
    end) |> Enum.into(%{})
  end

  def deal_or_dealt_action(p_id, id, id2, bid, bid2, previous_bid) do
    if p_id == id2 or p_id == id do
      {p_id, %{
        action: %{
          type: "DEALT",
          bidded: p_id == id,
          money: bid,
          money2: bid2,
          previousBid: previous_bid
        }
      }}
    else
      {p_id, %{
        action: %{
          type: "SOMEONE_DEALT",
          money: bid,
          money2: bid2,
          previousBid: previous_bid
        }
      }}
    end
  end

  def new_deal(bid, id, id2, now) do
    {bid, now, {id, id2}}
  end

  def dispatch_to_all(participants, action) do
    host = %{action: action}
    participant = Enum.map(participants, fn {id, _} -> {id, %{action: action}} end)
                  |> Enum.into(%{})
    {host, participant}
  end
end

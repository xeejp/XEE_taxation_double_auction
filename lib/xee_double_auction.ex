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
    {:ok, %{data: %{
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

  def filter_data(data) do
    rule = %{
      mode: true,
      participants: "users",
      buyer_bids: "buyerBids",
      seller_bids: "sellerBids",
      deals: true
    }
    data
    |> Map.update!(:buyer_bids, &mapelem(&1, 1))
    |> Map.update!(:seller_bids, &mapelem(&1, 1))
    |> Map.update!(:deals, &mapelem(&1, 0))
    |> Transmap.transform(rule)
  end

  def filter_data(data, id) do
    rule = %{
      mode: true,
      buyer_bids: "buyerBids",
      seller_bids: "sellerBids",
      deals: true,
      participants: {"personal", %{
        id => true,
        :_spread => [[id]]
      }},
    }
    data
    |> Map.update!(:buyer_bids, &mapelem(&1, 1))
    |> Map.update!(:seller_bids, &mapelem(&1, 1))
    |> Map.update!(:deals, &mapelem(&1, 0))
    |> Transmap.transform(rule)
  end

  def join(%{participants: participants} = data, id) do
    if not Map.has_key?(participants, id) do
      participant = %{role: nil, bidded: false, money: nil, bid: nil, dealt: false, deal: nil}
      participants = Map.put(participants, id, participant)
      new = %{data | participants: participants}
      wrap_result(data, new)
    else
      wrap_result(data, data)
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
    wrap_result(data, %{data | started: true})
  end

  def handle_received(data, %{"action" => "stop"}) do
    wrap_result(data, %{data | started: false})
  end

  def handle_received(data, %{"action" => "change_mode", "params" => mode}) do
    wrap_result(data, %{data | mode: mode})
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
    new = %{data | participants: participants,
     buyer_bids: [], seller_bids: [], deals: [],
     highest_bid: nil, lowest_bid: nil }
    wrap_result(data, new)
  end

  def mapelem(list, i) do
    Enum.map(list, &(elem(&1, i)))
  end

  def handle_received(data, %{"action" => "fetch_contents"}) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: filter_data(data)
    }
    {:ok, %{data: data, host: %{action: action}}}
  end

  def handle_received(data, %{"action" => "fetch_contents"}, id) do
    action = %{
      type: "RECEIVE_CONTENTS",
      payload: filter_data(data, id)
    }
    {:ok, %{data: data, participant: %{id => %{action: action}}}}
  end

  def handle_received(data, %{"action" => "bid", "params" => bid}, id) do
    old = data
    participant = Map.get(data.participants, id)
    data = case participant do
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
    wrap_result(old, data)
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
    data
  end

  def deal(data, bid_key, partner_key, id, bid, previous_bid, set) do
    now = DateTime.today()
    id2 = elem(data[bid_key], 0)
    deals = [new_deal(bid, id, id2, now) | data.deals]
    bids = List.delete(data[partner_key], data[bid_key])
    data = %{data | :deals => deals, partner_key => bids}
    data = dealt(data, id, id2, bid)

    data = set.(data)
    data
  end

  def new_deal(bid, id, id2, now) do
    {bid, now, {id, id2}}
  end

  def compute_diff(old, %{data: new} = result) do
    host = Map.get(result, :host, %{})
    participant = Map.get(result, :participant, %{})
    participant_tasks = Enum.map(old.participants, fn {id, _} ->
      {id, Task.async(fn -> JsonDiffEx.diff(filter_data(old, id), filter_data(new, id)) end)}
    end)
    host_task = Task.async(fn -> JsonDiffEx.diff(filter_data(old), filter_data(new)) end)
    host_diff = Task.await(host_task)
    participant_diff = Enum.map(participant_tasks, fn {id, task} -> {id, %{diff: Task.await(task)}} end)
                        |> Enum.filter(fn {_, map} -> map_size(map.diff) != 0 end)
                        |> Enum.into(%{})
    host = Map.merge(host, %{diff: host_diff})
    host = if map_size(host.diff) == 0 do
      Map.delete(host, :diff)
    else
      host
    end
    host = if map_size(host) == 0 do
      nil
    else
      host
    end
    participant = Map.merge(participant, participant_diff, fn _k, v1, v2 ->
      Map.merge(v1, v2)
    end)
    %{data: new, host: host, participant: participant}
  end

  def wrap_result(old, {:ok, result}) do
    {:ok, compute_diff(old, result)}
  end

  def wrap_result(old, new) do
    {:ok, compute_diff(old, %{data: new})}
  end
end

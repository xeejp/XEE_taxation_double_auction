import { handleActions } from 'redux-actions'
import combineSectionReducers from 'combine-section-reducers'

function removeFirst(list, target) {
  let found = false
  return list.filter(x => (found || !(found = x == target)))
}

const mode = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.mode
  },
  'CHANGE_MODE': (state, action) => {
    return action.payload
  }
}, "wait")

const personal = handleActions({
  'UPDATE_PERSONAL': (state, { personal }) => {
    return personal
  },
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.personal
  },
  'DEALT': (state, { bidded, money }) => {
    const bid = bidded
      ? money
      : state.bid
    return Object.assign({}, state, {
      bid,
      deal: money,
      dealt: true
    })
  },
  'NEW_BUYER_BIDS': (state, { bidded, money }) => {
    const bid = bidded
      ? money
      : state.bid
    return Object.assign({}, state, { bid })
  },
  'NEW_SELLER_BIDS': (state, { bidded, money }) => {
    const bid = bidded
      ? money
      : state.bid
    return Object.assign({}, state, { bid })
  },
}, {})

const buyerBids = handleActions({
  'UPDATE_PERSONAL': () => [],
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.buyerBids
  },
  'NEW_BUYER_BIDS': (state, { money, previousBid }) => {
    // Add new one and remove old one.
    let found = false
    return state.concat(money).filter(x => (found || !(found = x == previousBid)))
  },
  'DEALT': (state, { money2, previousBid }) => {
    return removeFirst(removeFirst(state, money2), previousBid)
  },
  'SOMEONE_DEALT': (state, { money2, previousBid }) => {
    return removeFirst(removeFirst(state, money2), previousBid)
  }
}, [])

const sellerBids = handleActions({
  'UPDATE_PERSONAL': () => [],
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.sellerBids
  },
  'NEW_SELLER_BIDS': (state, { money, previousBid }) => {
    // Add new one and remove old one.
    let found = false
    return state.concat(money).filter(x => (found || !(found = x == previousBid)))
  },
  'DEALT': (state, { money2, previousBid }) => {
    return removeFirst(removeFirst(state, money2), previousBid)
  },
  'SOMEONE_DEALT': (state, { money2, previousBid }) => {
    return removeFirst(removeFirst(state, money2), previousBid)
  }
}, [])

const deals = handleActions({
  'UPDATE_PERSONAL': () => [],
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.deals
  },
  'DEALT': (state, { money }) => {
    return state.concat(money)
  },
  'SOMEONE_DEALT': (state, { money }) => {
    return state.concat(money)
  }
}, [])

const reducer = combineSectionReducers({
  mode,
  personal,
  buyerBids,
  sellerBids,
  deals
})

export default reducer

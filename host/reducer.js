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

const users = handleActions({
  'RECEIVE_CONTENTS': (state, action) => {
    const { payload } = action
    return payload.users
  },
  'ADD_USER': (state, action) => {
    const { payload } = action
    return Object.assign({}, state, {
      [payload.id]: payload.user
    })
  },
  'UPDATE_USER': (state, { payload }) => {
    return Object.assign({}, state, {
      [payload.id]: payload.user
    })
  },
  'UPDATE_USERS': (state, { users }) => {
    return users
  }
}, {})

const buyerBids = handleActions({
  'UPDATE_USERS': () => [],
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
  }
}, [])

const sellerBids = handleActions({
  'UPDATE_USERS': () => [],
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
  }
}, [])

const deals = handleActions({
  'UPDATE_USERS': () => [],
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.deals
  },
  'DEALT': (state, { money }) => {
    return state.concat(money)
  }
}, [])

const reducer = combineSectionReducers({
  mode,
  users,
  buyerBids,
  sellerBids,
  deals,
})

export default reducer

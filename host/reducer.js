import { handleActions } from 'redux-actions'
import combineSectionReducers from 'combine-section-reducers'

import {
  changeMode, nextMode,
  enableScreenMode, disableScreenMode
} from 'host/actions'

function removeFirst(list, target) {
  let found = false
  return list.filter(x => (found || !(found = x == target)))
}

const mode = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.mode
  },
  [changeMode]: (state, action) => {
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
  'UPDATE_USER': (state, { id, user }) => {
    return Object.assign({}, state, {
      [id]: user
    })
  },
  'UPDATE_USERS': (state, { users }) => {
    return users
  },
  'NEW_BUYER_BIDS': (state, { money, id }) => {
    return Object.assign({}, state, {
      [id]: Object.assign({}, state[id], {
        bidded: true,
        bid: money
      })
    })
  },
  'NEW_SELLER_BIDS': (state, { money, id }) => {
    return Object.assign({}, state, {
      [id]: Object.assign({}, state[id], {
        bidded: true,
        bid: money
      })
    })
  },
  'DEALT': (state, { sellerID, buyerID, money }) => {
    return Object.assign({}, state, {
      [sellerID]: Object.assign({}, state[sellerID], {
        dealt: true,
        bid: money
      }),
      [buyerID]: Object.assign({}, state[buyerID], {
        dealt: true,
        bid: money
      })
    })
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

const screenMode = handleActions({
  [enableScreenMode]: (state, action) => true,
  [disableScreenMode]: (state, action) => false
}, false)

const reducer = combineSectionReducers({
  mode,
  users,
  buyerBids,
  sellerBids,
  deals,
  screenMode
})

export default reducer

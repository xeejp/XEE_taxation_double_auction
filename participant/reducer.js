import { handleActions } from 'redux-actions'
import combineSectionReducers from 'combine-section-reducers'

const mode = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.mode
  },
  'CHANGE_MODE': (state, action) => {
    return action.payload
  }
}, "wait")

const personal = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.personal
  },
  'DEALT': (state, action) => {
    return Object.assign({}, state, {
      bidded: false,
      bid: null,
      dealt: true
    })
  },
}, {})

const buyerBids = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.buyerBids
  },
  'NEW_BUYER_BIDS': (state, { money }) => {
    return state.concat(money)
  },
  'DEALT': (state, { money }) => {
    return state.filter(x => x != money)
  },
  'SOMEONE_DEALT': (state, { money }) => {
    return state.filter(x => x != money)
  }
}, [])

const sellerBids = handleActions({
  'RECEIVE_CONTENTS': (state, { payload }) => {
    return payload.sellerBids
  },
  'NEW_SELLER_BIDS': (state, { money }) => {
    return state.concat(money)
  },
  'DEALT': (state, { money }) => {
    return state.filter(x => x != money)
  },
  'SOMEONE_DEALT': (state, { money }) => {
    return state.filter(x => x != money)
  }
}, [])

const deals = handleActions({
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

import { createReducer } from 'redux-act'

const reducer = createReducer({
  'RECEIVE_CONTENTS': (_, contents) => contents
}, {
  mode: 'waiting',
  buyerBids: [],
  sellerBids: [],
  deals: [],
  personal: {
  }
})

export default reducer

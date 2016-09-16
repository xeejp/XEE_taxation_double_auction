import { handleActions } from 'redux-actions'
import combineSectionReducers from 'combine-section-reducers'

import {
  enableScreenMode, disableScreenMode
} from 'host/actions'

import { createReducer } from 'redux-act'

const reducer = createReducer({
  'RECEIVE_CONTENTS': (_, contents) => contents,
  [enableScreenMode]: (state, action) => Object.assign({}, state, {screenMode: true}),
  [disableScreenMode]: (state, action) => Object.assign({}, state, {screenMode: false})
}, {
  mode: 'wating',
  users: {},
  buyerBids: [],
  sellerBids: [],
  deals: [],
  screenMode: false
})

export default reducer

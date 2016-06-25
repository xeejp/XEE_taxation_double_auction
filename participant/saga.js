import { take, put, fork } from 'redux-saga/effects'

import { bid } from './actions'

function* bidSaga() {
  while (true) {
    const { payload } = yield take(`${bid}`)
    sendData('bid', payload)
  }
}

function* saga() {
  yield fork(bidSaga)
}

export default saga

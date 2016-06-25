import { take, put, fork } from 'redux-saga/effects'

import { changeMode, match } from './actions'

function* changeModeSaga() {
  while (true) {
    const { payload } = yield take(`${changeMode}`)
    sendData('change_mode', payload)
  }
}

function* matchSaga() {
  while (true) {
    yield take(`${match}`)
    sendData('match')
  }
}

function* saga() {
  yield fork(changeModeSaga)
  yield fork(matchSaga)
}

export default saga

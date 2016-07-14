import { take, put, fork, select, call } from 'redux-saga/effects'

import { submitMode, changeMode, match, nextMode } from './actions'

import { getMode } from 'util/index'

function* changeModeSaga() {
  while (true) {
    const { payload } = yield take(`${submitMode}`)
//    const result = yield call(confirm, getMode(payload) + "モードに移行しますか？")
//    if (result) {
      sendData('change_mode', payload)
      if (payload == 'description') {
        yield put(match())
      }
      yield put(changeMode(payload))
//    }
  }
}

function* nextModeSaga() {
  const modes = ["description", "auction", "result", "wait"]
  while (true) {
    yield take(`${nextMode}`)
    const mode = yield select(({ mode }) => mode)
    let next = modes[0]
    for (let i = 0; i < modes.length; i ++) {
      if (mode == modes[i]) {
        next = modes[(i + 1) % modes.length]
        break
      }
    }
    yield put(submitMode(next))
  }
}

function* matchSaga() {
  while (true) {
    yield take(`${match}`)
//    const result = yield call(confirm, "マッチングを行いますか？")
//    if (result) {
      sendData('match')
//    }
  }
}

function* saga() {
  yield fork(changeModeSaga)
  yield fork(nextModeSaga)
  yield fork(matchSaga)
}

export default saga

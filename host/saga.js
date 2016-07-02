import { take, put, fork, select } from 'redux-saga/effects'

import { submitMode, changeMode, match, nextMode } from './actions'

function* changeModeSaga() {
  while (true) {
    const { payload } = yield take(`${submitMode}`)
    sendData('change_mode', payload)
    yield put(changeMode(payload))
  }
}

function* nextModeSaga() {
  const modes = ["description", "auction", "result"]
  while (true) {
    yield take(`${nextMode}`)
    if (confirm("本当に次のモードに移行しますか？")) {
      const mode = yield select(({ mode }) => mode)
      for (let i = 0; i < modes.length; i ++) {
        if (mode == modes[i]) {
          yield put(submitMode(modes[(i + 1) % modes.length]))
          break
        }
      }
    }
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
  yield fork(nextModeSaga)
  yield fork(matchSaga)
}

export default saga

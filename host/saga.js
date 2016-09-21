import { take, put, fork, select, call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import {
  submitMode, changeMode, match, nextMode,
  submitTaxType, submitTaxTarget, submitProportionalRatio,
  submitLumpSumTax, submitRegressiveRatio, submitProgressiveRatio
} from './actions'

import { getMode } from 'util/index'

function* changeModeSaga() {
  while (true) {
    const { payload } = yield take(`${submitMode}`)
    sendData('change_mode', payload)
    if (payload == 'description') {
      yield put(match())
    }
    yield put(changeMode(payload))
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
    sendData('match')
  }
}

function* submitTaxTypeSaga(action) {
  sendData('change_tax_type', action.payload)
}
function* submitTaxTargetSaga(action) {
  sendData('change_tax_target', action.payload)
}
function* submitLumpSumTaxSaga(action) {
  sendData('change_lump_sum_tax', action.payload)
}
function* submitProportionalRatioSaga(action) {
  sendData('change_proportional_ratio', action.payload)
}
function* submitRegressiveRatioSaga(action) {
  sendData('change_regressive_ratio', action.payload)
}
function* submitProgressiveRatioSaga(action) {
  sendData('change_progressive_ratio', action.payload)
}

function* saga() {
  yield fork(changeModeSaga)
  yield fork(nextModeSaga)
  yield fork(matchSaga)

  yield fork(takeEvery, `${submitTaxType}`, submitTaxTypeSaga)
  yield fork(takeEvery, `${submitTaxTarget}`, submitTaxTargetSaga)
  yield fork(takeEvery, `${submitLumpSumTax}`, submitLumpSumTaxSaga)
  yield fork(takeEvery, `${submitProportionalRatio}`, submitProportionalRatioSaga)
  yield fork(takeEvery, `${submitRegressiveRatio}`, submitRegressiveRatioSaga)
  yield fork(takeEvery, `${submitProgressiveRatio}`, submitProgressiveRatioSaga)
}

export default saga

import { createAction } from 'redux-actions'

export const match = createAction('MATCH')

export const changeMode = createAction('CHANGE_MODE', mode => mode)
export const submitMode = createAction('SUBMIT_MODE', mode => mode)
export const nextMode = createAction('NEXT_MODE')

export const enableScreenMode = createAction('ENABLE_SCREEN_MODE')
export const disableScreenMode = createAction('DISABLE_SCREEN_MODE')

export const submitTaxType = createAction('submit tax type', params => params)
export const submitTaxTarget = createAction('submit tax target', params => params)
export const submitLumpSumTax = createAction('submit lump sum tax', params => params)
export const submitProportionalRatio = createAction('submit proportional ratio', params => params)
export const submitRegressiveRatio = createAction('submit regressive ratio', params => params)
export const submitProgressiveRatio = createAction('submit progressive ratio', params => params)

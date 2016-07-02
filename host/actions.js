import { createAction } from 'redux-actions'

export const fetchContents = createAction('FETCH_CONTENTS')

// modes
export const start = createAction('START')
export const result = createAction('RESULT')
export const wait = createAction('WAIT')
export const description = createAction('DESCRIPTION')

export const match = createAction('MATCH')

export const changeMode = createAction('CHANGE_MODE', mode => mode)
export const submitMode = createAction('SUBMIT_MODE', mode => mode)
export const nextMode = createAction('NEXT_MODE')

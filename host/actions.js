import { createAction } from 'redux-actions'

export const fetchContents = createAction('FETCH_CONTENTS')
export const start = createAction('START')
export const result = createAction('RESULT')
export const wait = createAction('WAIT')
export const match = createAction('MATCH')
export const description = createAction('DESCRIPTION')

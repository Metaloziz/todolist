import { appReducer, initializeAppTC, setAppErrorAC, setAppStatusAC } from 'store'
import { InitialStateType, RequestStatusType } from 'types'

let startState: InitialStateType
let status: RequestStatusType
let error: string
let isInitialized: boolean

beforeEach(() => {
  startState = {
    isInitialized: false,
    error: null,
    status: 'idle',
  }
  status = 'loading'
  error = 'Big Error Message'
  isInitialized = true
})

describe('app-reducer', () => {
  test('correct status should be set', () => {
    const action = setAppStatusAC({ status })
    const endState = appReducer(startState, action)

    expect(endState.status).toBe(status)
  })

  test('correct error message should be set', () => {
    const action = setAppErrorAC({ error })
    const endState = appReducer(startState, action)

    expect(endState.error).toBe(error)
  })

  test('set initialize status', () => {
    const action = initializeAppTC.fulfilled(undefined, '', { isInitialized })
    const endState = appReducer(startState, action)

    expect(endState.isInitialized).toBe(isInitialized)
  })
})

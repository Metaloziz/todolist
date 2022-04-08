import {
  appReducer,
  InitialStateType, RequestStatusType,
  setAppErrorAC, setAppInitializedAC,
  setAppStatusAC
} from 'store/app-reducer'

let startState: InitialStateType;
let status: RequestStatusType
let error: string
let isInitialized: boolean

beforeEach(() => {
  startState = {
    isInitialized: false,
    error: null,
    status: 'idle'
  }
  status = "loading"
  error = "Big Error Message"
  isInitialized = true
})

describe('app-reducer', () => {

  test('correct status should be set', () => {

    const action = setAppStatusAC({status});
    const endState = appReducer(startState, action)

    expect(endState.status).toBe(status);
  })

  test('correct error message should be set', () => {

    const action = setAppErrorAC({error});
    const endState = appReducer(startState, action)

    expect(endState.error).toBe(error);
  })

  test('set initialize status', () => {

    const action = setAppInitializedAC({isInitialized});
    const endState = appReducer(startState, action)

    expect(endState.isInitialized).toBe(isInitialized);
  })
})


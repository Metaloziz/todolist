import {
  appReducer,
  InitialStateType, RequestStatusType,
  setAppErrorAC, setAppInitializedAC,
  setAppStatusAC
} from 'app/app-reducer'

let startState: InitialStateType;
let newStatus: RequestStatusType
let someError: string
let isInitialized: boolean

beforeEach(() => {
  startState = {
    isInitialized: false,
    error: null,
    status: 'idle'
  }
  newStatus = "loading"
  someError = "Big Error Message"
  isInitialized = true
})
describe('app-reducer', () => {

  test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC(newStatus))

    expect(endState.status).toBe(newStatus);
  })

  test('correct error message should be set', () => {

    const endState = appReducer(startState, setAppErrorAC(someError))

    expect(endState.error).toBe(someError);
  })

  test('set initialize status', () => {

    const endState = appReducer(startState, setAppInitializedAC(isInitialized))

    expect(endState.isInitialized).toBe(isInitialized);

  })

})


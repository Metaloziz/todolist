import {authReducer, setIsLoggedInAC} from "features/Login/auth-reducer";
//
// type InitialStateType = {
//   isLoggedIn: boolean
// }

const initialState = {
  isLoggedIn: false
}

let newIsLoginValue: boolean

beforeEach(() => {
  newIsLoginValue = true
})

describe('auth-reducer', () => {

  test('set is login in', () => {

    let action = setIsLoggedInAC({isInitialized: newIsLoginValue})

    let endState = authReducer(initialState, action)

    expect(initialState).not.toBe(endState)
    expect(endState.isLoggedIn).toBe(newIsLoginValue)
  })
})
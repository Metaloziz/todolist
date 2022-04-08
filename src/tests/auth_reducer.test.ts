import {authReducer, setIsLoggedInAC} from "store/auth-reducer";
//
// type InitialStateType = {
//   isLoggedIn: boolean
// }

const initialState = {
  isLoggedIn: false
}

let isLoggedIn: boolean

beforeEach(() => {
  isLoggedIn = true
})

describe('auth-reducer', () => {

  test('set is login in', () => {

    let action = setIsLoggedInAC({ isLoggedIn})

    let endState = authReducer(initialState, action)

    expect(initialState).not.toBe(endState)
    expect(endState.isLoggedIn).toBe(isLoggedIn)
  })
})
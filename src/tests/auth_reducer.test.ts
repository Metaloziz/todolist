import { authReducer, setIsLoggedInAC } from 'store'

const initialState = {
  isLoggedIn: false,
}

let isLoggedIn: boolean

beforeEach(() => {
  isLoggedIn = true
})

describe('auth-reducer', () => {
  test('set is login in', () => {
    const action = setIsLoggedInAC({ isLoggedIn })

    const endState = authReducer(initialState, action)

    expect(initialState).not.toBe(endState)
    expect(endState.isLoggedIn).toBe(isLoggedIn)
  })
})

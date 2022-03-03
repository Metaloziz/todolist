import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {
  handleServerAppError,
  handleServerNetworkError
} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
}


const slice = createSlice({
  name: 'auth', // на основании этого имени будут генерироваться типы actions
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLogin: boolean }>) {
      state.isLoggedIn = action.payload.isLogin  // innerJs позволяет менять стейт буд-то мутируя его, остальное она сама сделает
    }
  }
})

export const {setIsLoggedInAC} = slice.actions

export const authReducer = slice.reducer
// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'login/SET-IS-LOGGED-IN':
//       return {...state, isLoggedIn: action.value}
//     default:
//       return state
//   }
// }

// actions

// export const setIsLoggedInAC = (value: boolean) =>
//   ({type: 'login/SET-IS-LOGGED-IN', value} as const)
//

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({isLogin: true}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.logout()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({isLogin: false}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

// types

// type ActionsType = ReturnType<typeof setIsLoggedInAC>
// type InitialStateType = {
//   isLoggedIn: boolean
// }

// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>

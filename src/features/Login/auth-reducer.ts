import {Dispatch} from 'redux'
import {setAppStatusAC} from 'app/app-reducer'
import {authAPI, LoginParamsType} from 'api/todolists-api'
import {
  handleServerAppError,
  handleServerNetworkError
} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk('auth/loginTC', async (data: LoginParamsType, {dispatch}) => {
  dispatch(setAppStatusAC({status: 'loading'}))

  try {
    let responce = await authAPI.login(data)
    if (responce.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      dispatch(setIsLoggedInAC({isLogin: true}))
    } else {
      handleServerAppError(responce.data, dispatch)
    }
  } catch (error) {
    const {response, message} = error as AxiosError;
    handleServerNetworkError({message}, dispatch)
  }
})

// export const loginTC_ = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({status: 'loading'}))
//   authAPI.login(data)
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({isLogin: true}))
//         dispatch(setAppStatusAC({status: 'succeeded'}))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

const slice = createSlice({
  name: 'auth', // на основании этого имени будут генерироваться типы actions
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLogin: boolean }>) {
      state.isLoggedIn = action.payload.isLogin  // innerJs позволяет менять стейт буд-то мутируя его, остальное она сама сделает
    }
  }
})

export const {setIsLoggedInAC} = slice.actions

export const authReducer = slice.reducer

// thunks

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

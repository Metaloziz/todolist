import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { authAPI } from 'api'
import { StatusCode } from 'enums'
import { setAppStatusAC } from 'store'
import { LoginParamsType } from 'types'
import { handleServerAppError, handleServerNetworkError } from 'utils'

export const loginTC = createAsyncThunk(
  'auth/loginTC',
  async (data: LoginParamsType, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    try {
      const res = await authAPI.login(data)
      if (res.data.resultCode === StatusCode.Success) {
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        return { isLoggedIn: true }
      }
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({ isLoggedIn: false })
    } catch (error) {
      const { message } = error as AxiosError
      handleServerNetworkError({ message }, dispatch)
      return rejectWithValue({ isLoggedIn: false })
    }
  },
)

export const logoutTC = createAsyncThunk(
  'auth/logoutTC',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      const res = await authAPI.logout()
      if (res.data.resultCode === StatusCode.Success) {
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        return { isLoggedIn: false }
      }
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({})
    } catch (e) {
      const error = e as AxiosError
      handleServerNetworkError(error, dispatch)
      return rejectWithValue({})
    }
  },
)

const slice = createSlice({
  name: 'Auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
})

export const authReducer = slice.reducer

export const { setIsLoggedInAC } = slice.actions

import {setAppStatusAC} from 'store/app-reducer'
import {authAPI, LoginParamsType} from 'api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk('auth/loginTC', async (data: LoginParamsType, {
  dispatch,
  rejectWithValue
}) => {
  dispatch(setAppStatusAC({status: "loading"}))
  try {
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: true}  // можно убрать, так как если мы попали в этот кейс, то это априори успех
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({isLoggedIn: false}) // это из toolkit
    }
  } catch (error) {
    const {message} = error as AxiosError
    handleServerNetworkError({message}, dispatch)
    return rejectWithValue({isLoggedIn: false})
  }
})

export const logoutTC = createAsyncThunk('auth/logoutTC', async (data, {
  dispatch,
  rejectWithValue
}) => {

  // data не используется

  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: false}
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({})
    }

  } catch (e) {
    const error = e as AxiosError
    handleServerNetworkError(error, dispatch)
    return rejectWithValue({})
  }

})

// thunks

const slice = createSlice({
  name: 'Auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn // пока оставим, хоть и продублировали код в кейсе ниже
    }
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  }
})

export const authReducer = slice.reducer

export const {setIsLoggedInAC} = slice.actions

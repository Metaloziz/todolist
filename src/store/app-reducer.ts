import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { authAPI } from "api/todolists-api";
import { StatusCode } from "enums/enums";
import { setIsLoggedInAC } from "store/auth-reducer";
import { InitialStateType, RequestStatusType } from "types/appReducerType";

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false,
}

export const initializeAppTC = createAsyncThunk(
  'App/initializeAppTC',
  async (params: { isInitialized: boolean }, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === StatusCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
      } else {
        console.warn(res)
      }
    } catch (e) {
      console.warn(e)
      return rejectWithValue({ error: 'some error' })
    }
    return undefined
  },
)

const slice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeAppTC.fulfilled, state => {
      state.isInitialized = true
    })
  },
})

export const appReducer = slice.reducer
export const { setAppStatusAC, setAppErrorAC } = slice.actions

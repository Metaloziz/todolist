import {authAPI} from 'api/todolists-api'
import {setIsLoggedInAC} from 'store/auth-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false
}

export const initializeAppTC = createAsyncThunk('App/initializeAppTC', async (params, {dispatch}) => {

  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({isLoggedIn: true}));
    } else {

    }
  } catch (e) {

  }
})

const slice = createSlice({
  name: 'App',
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    }
  },
  extraReducers: builder => {
    builder.addCase(initializeAppTC.fulfilled, (state) => {
      state.isInitialized = true
    })
  }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
  isInitialized: boolean
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

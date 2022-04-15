import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {RequestStatusType, setAppStatusAC} from 'store/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk('Todolist/fetchTodolistsTC', async (params, {dispatch}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolists: res.data}
  } catch (e) {
    const error = e as AxiosError
    handleServerNetworkError(error, dispatch);
  }
})
export const removeTodolistTC = createAsyncThunk('Todolist/removeTodolistTC', async (todolistId: string, {dispatch}) => {
  try {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    //скажем глобально приложению, что асинхронная операция завершена
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {id: todolistId}
  } catch (e) {
    console.warn(e)
  }
})
export const addTodolistTC = createAsyncThunk('', async (title: string, {dispatch}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolist: res.data.data.item}
  } catch (e) {
    console.warn(e)
  }
})

type ChangeTodolistTitleTCType = {
  id: string,
  title: string
}

export const changeTodolistTitleTC = createAsyncThunk('Todolist/changeTodolistTitleTC', async ({
                                                                                                 id,
                                                                                                 title
                                                                                               }: ChangeTodolistTitleTCType,) => {

  try {
    const res = await todolistsAPI.updateTodolist(id, title)
    console.log(res)
    return {id, title}
  } catch (e) {
    console.warn(e)
  }
})


const slice = createSlice({
  name: 'Todolist',
  initialState: initialState,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      let todolistIndex = state.findIndex((list) => list.id === action.payload.id)
      if (todolistIndex !== -1) {
        state[todolistIndex].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      let todolistIndex = state.findIndex((list) => list.id === action.payload.id)
      if (todolistIndex !== -1) {
        state[todolistIndex].entityStatus = action.payload.status
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      let filter: FilterValuesType = "all"
      let entityStatus: RequestStatusType = "idle"
      if (action.payload) {
        state.push(...action.payload.todolists.map((list) => ({
          ...list, filter, entityStatus
        })))
      }
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      let todolistIndex = state.findIndex((list) => list.id === action.payload?.id)
      if (todolistIndex !== -1) {
        state.splice(todolistIndex, 1)
      }
    })
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.unshift({
          ...action.payload.todolist,
          filter: 'all',
          entityStatus: 'idle'
        })
      }
    })
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      if (action.payload) {
        let todolistIndex = state.findIndex((list) => list.id === action.payload?.id)
        if (todolistIndex !== -1) {
          state[todolistIndex].title = action.payload.title
        }
      }
    })
  }
})

export const todolistsReducer = slice.reducer

export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
} = slice.actions

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

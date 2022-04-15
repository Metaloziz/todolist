import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { todoListsAPI } from "api/todolists-api";
import { CountItem, FindIndex } from "enums/enums";
import { setAppStatusAC } from "store/app-reducer";
import { RequestStatusType } from "types/appReducerType";
import {
  ChangeTodolistTitleTCType,
  FilterValuesType,
  TodolistDomainType
} from "types/todoListReducerType";
import { handleServerNetworkError } from "utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk(
  'Todolist/fetchTodolistsTC',
  async (params, { dispatch }) => {
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      const res = await todoListsAPI.getTodoLists()
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      return { todolists: res.data }
    } catch (e) {
      const error = e as AxiosError
      handleServerNetworkError(error, dispatch)
      return undefined
    }
  },
)
export const addTodolistTC = createAsyncThunk('', async (title: string, { dispatch }) => {
  try {
    dispatch(setAppStatusAC({ status: 'loading' }))
    const res = await todoListsAPI.createTodolist(title)
    dispatch(setAppStatusAC({ status: 'succeeded' }))
    return { todolist: res.data.data.item }
  } catch (e) {
    console.warn(e)
    return undefined
  }
})
export const changeTodolistTitleTC = createAsyncThunk(
  'Todolist/changeTodolistTitleTC',
  async ({ id, title }: ChangeTodolistTitleTCType) => {
    try {
      const res = await todoListsAPI.updateTodolist(id, title)
      console.log(res)
      return { id, title }
    } catch (e) {
      console.warn(e)
      return undefined
    }
  },
)
export const removeTodolistTC = createAsyncThunk(
  'Todolist/removeTodolistTC',
  async (todolistId: string, { dispatch }) => {
    try {
      dispatch(setAppStatusAC({ status: 'loading' }))
      dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'loading' }))
      const res = await todoListsAPI.deleteTodolist(todolistId)
      console.log(res)
      dispatch(setAppStatusAC({ status: 'succeeded' }))
      return { id: todolistId }
    } catch (e) {
      console.warn(e)
      return undefined
    }
  },
)

const slice = createSlice({
  name: 'Todolist',
  initialState,
  reducers: {
    changeTodolistFilterAC(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>,
    ) {
      const todolistIndex = state.findIndex(list => list.id === action.payload.id)
      if (todolistIndex !== FindIndex.NotSuccess) {
        state[todolistIndex].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>,
    ) {
      const todolistIndex = state.findIndex(list => list.id === action.payload.id)
      if (todolistIndex !== FindIndex.NotSuccess) {
        state[todolistIndex].entityStatus = action.payload.status
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      const filter: FilterValuesType = 'all'
      const entityStatus: RequestStatusType = 'idle'
      if (action.payload) {
        state.push(
          ...action.payload.todolists.map(list => ({
            ...list,
            filter,
            entityStatus,
          })),
        )
      }
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const todolistIndex = state.findIndex(list => list.id === action.payload?.id)
      if (todolistIndex !== FindIndex.NotSuccess) {
        state.splice(todolistIndex, CountItem.One)
      }
    })
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      if (action.payload) {
        state.unshift({
          ...action.payload.todolist,
          filter: 'all',
          entityStatus: 'idle',
        })
      }
    })
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      if (action.payload) {
        const todolistIndex = state.findIndex(list => list.id === action.payload?.id)
        if (todolistIndex !== FindIndex.NotSuccess) {
          state[todolistIndex].title = action.payload.title
        }
      }
    })
  },
})

export const todolistsReducer = slice.reducer

export const { changeTodolistFilterAC, changeTodolistEntityStatusAC } = slice.actions

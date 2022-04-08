import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {Dispatch} from 'redux'
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from 'store/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import produce from "immer"

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'Todolist',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      let todolistIndex = state.findIndex((list) => list.id === action.payload.id)
      if (todolistIndex !== -1) {
        state.splice(todolistIndex, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist,
        filter: 'all',
        entityStatus: 'idle'
      })
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      let todolistIndex = state.findIndex((list) => list.id === action.payload.id)
      if (todolistIndex !== -1) {
        state[todolistIndex].title = action.payload.title
      }
    },
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
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {

      let filter: FilterValuesType = "all"
      let entityStatus: RequestStatusType = "idle"

      state.push(...action.payload.todolists.map((list) => ({
        ...list, filter, entityStatus
      })))
    },
  }
})

export const todolistsReducer = slice.reducer

export const {
  removeTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  setTodolistsAC,
  addTodolistAC
} = slice.actions

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch);
      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        dispatch(removeTodolistAC({id: todolistId}))
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatusAC({status: 'succeeded'}))
      })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistsAPI.createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title)
      .then((res) => {
        dispatch(changeTodolistTitleAC({id, title}))
      })
  }
}

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

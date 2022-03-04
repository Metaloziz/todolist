import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TodolistDomainType[] = []


const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state: TodolistDomainType[], action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(el => el.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist, filter: 'all', entityStatus: 'idle'
      })
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      let {id, title} = action.payload
      const index = state.findIndex(el => el.id === id)
      if (index > -1) {
        state[index].title = title
      }
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      let {id, filter} = action.payload
      const index = state.findIndex(el => el.id === id)
      if (index > -1) {
        state[index].filter = filter
      }
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      let {id, status} = action.payload
      const index = state.findIndex(el => el.id === id)
      if (index > -1) {
        state[index].entityStatus = status
      }
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistType[] }>) {
      let {todolists} = action.payload
      return todolists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle'
      }))
    },
  }
})
export const todolistsReducer = slice.reducer

export const {
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  changeTodolistEntityStatusAC,
  removeTodolistAC,
  setTodolistsAC,
  addTodolistAC
} = slice.actions

console.log(changeTodolistFilterAC.type);

// export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case 'REMOVE-TODOLIST':
//       return state.filter(tl => tl.id !== action.id)
//     case 'ADD-TODOLIST':
//       return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
//     case 'CHANGE-TODOLIST-TITLE':
//       return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//     case 'CHANGE-TODOLIST-FILTER':
//       return state.map(tl => tl.id === action.id ? {
//         ...tl,
//         filter: action.filter
//       } : tl)
//     case 'CHANGE-TODOLIST-ENTITY-STATUS':
//       return state.map(tl => tl.id === action.id ? {
//         ...tl,
//         entityStatus: action.status
//       } : tl)
//     case 'SET-TODOLISTS':
//       return action.todolists.map(tl => ({
//         ...tl,
//         filter: 'all',
//         entityStatus: 'idle'
//       }))
//     default:
//       return state
//   }
// }

// actions
// export const removeTodolistAC = (id: string) => ({
//   type: 'REMOVE-TODOLIST',
//   id
// } as const)
// export const addTodolistAC = (todolist: TodolistType) => ({
//   type: 'ADD-TODOLIST',
//   todolist
// } as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//   type: 'CHANGE-TODOLIST-TITLE',
//   id,
//   title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//   type: 'CHANGE-TODOLIST-FILTER',
//   id,
//   filter
// } as const)
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
//   type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
// } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
//   type: 'SET-TODOLISTS',
//   todolists
// } as const)

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
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title)
      .then((res) => {
        dispatch(changeTodolistTitleAC({id, title}))
      })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>






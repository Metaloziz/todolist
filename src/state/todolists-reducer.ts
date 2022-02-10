import {v1} from 'uuid';
import {TodolistType} from "../api/todolist-api";

const initialState: TodolistDomainType[] = []

export const todolistsReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsType): TodolistDomainType[] => {

  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      return state.filter(tl => tl.id !== action.id)
    }
    case 'ADD-TODOLIST': {
      return [{
        id: action.todolistId,
        title: action.title,
        addedDate: '',
        order: 0,
        filter: 'all'
      }, ...state]
    }
    case 'CHANGE-TODOLIST-TITLE': {
      return [...state]
        .map(el => el.id === action.id ? {...el, title: action.title} : el)
    }
    case 'CHANGE-TODOLIST-FILTER': {
      return [...state]
        .map(el => el.id === action.id ? {...el, filter: action.filter} : el)
    }
    default:
      return state;
  }
}

export const removeTodolistAC = (todolistId: string) => ({
  type: 'REMOVE-TODOLIST',
  id: todolistId
} as const)

export const addTodolistAC = (title: string) => ({
  type: 'ADD-TODOLIST',
  title,
  todolistId: v1()
} as const)

export const changeTodolistTitleAC = (id: string, title: string) => ({
  type: 'CHANGE-TODOLIST-TITLE',
  id,
  title
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  id,
  filter
} as const)


export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

type ActionsType =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>

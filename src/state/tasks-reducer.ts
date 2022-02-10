import {v1} from 'uuid';
import {addTodolistAC, removeTodolistAC} from './todolists-reducer';
import {TasksStateType} from '../App';
import {TaskPriorities, TaskStatus, TaskType} from "../api/todolist-api";


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      const stateCopy = {...state}
      const tasks = stateCopy[action.todolistId];
      stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
      return stateCopy;
    }
    case 'ADD-TASK': {
      const newTask: TaskType = {
        id: v1(),
        title: action.title,
        status: TaskStatus.InProgress,
        todoListId: action.todolistId,
        order: 0,
        description: 'null',
        addedDate: new Date(),
        startDate: new Date(),
        priority: TaskPriorities.Middle,
        deadline: new Date(),
        completed: false,
      }
      return {...state, [action.todolistId]: [newTask, ...state[action.todolistId]]}
    }
    case 'CHANGE-TASK-STATUS': {
      return {
        ...state, [action.todolistId]: state[action.todolistId]
          .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
      }
    }
    case 'CHANGE-TASK-TITLE': {
      return {
        ...state, [action.todolistId]: state[action.todolistId]
          .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
      }
    }
    case 'ADD-TODOLIST': {
      return {...state, [action.todolistId]: []}
    }
    case 'REMOVE-TODOLIST': {
      const copyState = {...state};
      delete copyState[action.id];
      return copyState;
    }
    default:
      return state;
  }
}

export const removeTaskAC = (taskId: string, todolistId: string) => ({
  type: 'REMOVE-TASK',
  taskId,
  todolistId
} as const)

export const addTaskAC = (title: string, todolistId: string) => ({
  type: 'ADD-TASK',
  title,
  todolistId
} as const)

export const changeTaskStatusAC = (taskId: string, status: TaskStatus, todolistId: string) => ({
  type: 'CHANGE-TASK-STATUS',
  status,
  todolistId,
  taskId
} as const)

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
  type: 'CHANGE-TASK-TITLE',
  title,
  todolistId,
  taskId
} as const)


type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof changeTaskStatusAC>
  | ReturnType<typeof changeTaskTitleAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>


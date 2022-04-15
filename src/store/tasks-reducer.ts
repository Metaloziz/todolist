import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { todoListsAPI } from "api/todolists-api";
import { CountItem, FindIndex, StatusCode } from "enums/enums";
import { setAppStatusAC } from "store/app-reducer";
import { AppRootStateType } from "store/store";
import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC
} from "store/todolists-reducer";
import {
  AddTaskTCType,
  RemoveTaskTCType,
  TasksStateType,
  UpdateTaskTCType
} from "types/tasksReducerType";
import { UpdateTaskModelType } from "types/TypesAPI";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk(
  'Tasks/fetchTasksTC',
  async (todolistId: string, { dispatch }) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    const response = await todoListsAPI.getTasks(todolistId)
    const tasks = response.data.items
    dispatch(setAppStatusAC({ status: 'succeeded' }))
    return { tasks, todolistId }
  },
)

export const addTaskTC = createAsyncThunk(
  'Tasks/addTaskTC',
  ({ todolistId, title }: AddTaskTCType, { dispatch }) => {
    dispatch(setAppStatusAC({ status: 'loading' }))
    return todoListsAPI
      .createTask(todolistId, title)
      .then(res => {
        if (res.data.resultCode === StatusCode.Success) {
          const task = res.data.data.item
          dispatch(setAppStatusAC({ status: 'succeeded' }))
          return { task }
        }
        handleServerAppError(res.data, dispatch)
        return undefined
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  },
)

export const removeTaskTC = createAsyncThunk(
  'Tasks/removeTaskTC',
  ({ taskId, todolistId }: RemoveTaskTCType) =>
    todoListsAPI.deleteTask(todolistId, taskId).then(res => {
      if (res.data.resultCode === StatusCode.Success) {
        return { taskId, todolistId }
      }
      return undefined
    }),
)

export const updateTaskTC = createAsyncThunk(
  'Task/updateTaskTC',
  ({ taskId, todolistId, domainModel }: UpdateTaskTCType, { dispatch, getState }) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      console.warn('task not found in the state')
      return undefined
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    }

    return todoListsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === StatusCode.Success) {
          return { taskId, model: domainModel, todolistId }
        }
        handleServerAppError(res.data, dispatch)
        return undefined
      })
      .catch(error => {
        handleServerNetworkError(error, dispatch)
      })
  },
)

const slice = createSlice({
  name: 'Tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      if (action.payload) {
        state[action.payload.todolist.id] = []
      }
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      if (action.payload) {
        delete state[action.payload.id]
      }
    })
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      if (action.payload) {
        action.payload.todolists.forEach(({ id }) => {
          state[id] = []
        })
      }
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      const { todolistId, tasks } = action.payload
      state[todolistId].unshift(...tasks)
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      const { task } = action.payload
      state[task.todoListId].unshift(task)
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      const { todolistId, taskId } = action.payload
      const taskIndex = state[todolistId].findIndex(({ id }) => id === taskId)
      if (taskIndex !== FindIndex.NotSuccess) {
        state[todolistId].splice(taskIndex, CountItem.One)
      }
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      const { taskId, todolistId, model } = action.payload
      const tasks = state[todolistId]
      const taskIndex = state[todolistId].findIndex(({ id }) => id === taskId)
      if (taskIndex !== FindIndex.NotSuccess) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...model }
      }
    })
  },
})

export const tasksReducer = slice.reducer

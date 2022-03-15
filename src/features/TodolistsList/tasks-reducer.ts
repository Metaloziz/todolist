import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from 'api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from 'app/store'
import {setAppStatusAC} from 'app/app-reducer'
import {
  handleServerAppError,
  handleServerNetworkError
} from 'utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

// при вызове вызывается payloadCreator, в него мы должны передать только один параметр, если их много значит объект.
// второй аргумент это thunkAPI, в нём полезные штуки (dispatch ... )
// внутри ещё и actions создаются
export const fetchTasksTC = createAsyncThunk('task/fetchTasksTC', async (todolistId: string, {dispatch}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  let res = await todolistsAPI.getTasks(todolistId)
  const tasks = res.data.items
  dispatch(setAppStatusAC({status: 'succeeded'}))
  return {tasks, todolistId} // эти данные используются в builder.addCase(fetchTasksTC.fulfilled,
})

type RemoveTaskPayload = {
  todolistId: string
  taskId: string
}
export const removeTaskTC = createAsyncThunk('task/removeTaskTC', (payload: RemoveTaskPayload, {dispatch}) => {
  let {taskId, todolistId} = payload
  return todolistsAPI.deleteTask(todolistId, taskId)
    .then((res) => {
      return {taskId, todolistId}
    })
})

type AddTaskPayload = {
  todolistId: string
  title: string
}

export const addTaskTC = createAsyncThunk('task/addTaskTC', (payload: AddTaskPayload, {dispatch}) => {
  let {todolistId, title} = payload
  dispatch(setAppStatusAC({status: 'loading'}))
  return todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {task}
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
})

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      let {task} = action.payload
      state[task.todoListId].unshift(task)
    },
    updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      let {taskId, todolistId, model} = action.payload
      const tasks = state[todolistId]
      const index = tasks.findIndex(el => el.id === taskId)
      if (index > -1) {
        tasks[index] = {...tasks[index], ...model}
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach(tl => {
        state[tl.id] = []
      })
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      //fetchTasksTC.fulfilled наш новый AC, вызывается автоматом
      let {tasks, todolistId} = action.payload
      state[todolistId] = tasks
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      //fetchTasksTC.fulfilled наш новый AC, вызывается автоматом
      let {taskId, todolistId} = action.payload
      const index = state[todolistId].findIndex(el => el.id === taskId)
      if (index > -1) {
        state[todolistId].splice(index, 1)
      }
    })
    // builder.addCase(addTaskTC.fulfilled, (state, action) => {
    //   let {task} = action.payload
    //   state[task.todoListId].unshift(task)
    // })
  }
})

export const {updateTaskAC, addTaskAC} = slice.actions
export const tasksReducer = slice.reducer


export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === 0) {
          const action = updateTaskAC({taskId, model: domainModel, todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      })
  }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

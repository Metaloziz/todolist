import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC
} from 'store/todolists-reducer'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType
} from 'api/todolists-api'
import {AppRootStateType} from 'store/store'
import {setAppStatusAC} from 'store/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('Tasks/fetchTasksTC', async (todolistId: string, {dispatch}) => {
  dispatch(setAppStatusAC({status: 'loading'}))
  const response = await todolistsAPI.getTasks(todolistId)
  const tasks = response.data.items
  dispatch(setAppStatusAC({status: 'succeeded'}))
  return {tasks, todolistId}
})

// thunks
type AddTaskTCType = {
  title: string, todolistId: string
}

export const addTaskTC = createAsyncThunk('Tasks/addTaskTC', ({
                                                                todolistId,
                                                                title
                                                              }: AddTaskTCType, {dispatch},) => {
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

type RemoveTaskTCType = {
  taskId: string, todolistId: string
}

export const removeTaskTC = createAsyncThunk('Tasks/removeTaskTC', ({
                                                                      taskId,
                                                                      todolistId
                                                                    }: RemoveTaskTCType, {dispatch}) => {
  return todolistsAPI.deleteTask(todolistId, taskId)
    .then(res => ({taskId, todolistId}))
})

export type UpdateTaskTCType = {
  taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string
}

export const updateTaskTC = createAsyncThunk('Task/updateTaskTC', ({
                                                                     taskId,
                                                                     todolistId,
                                                                     domainModel
                                                                   }: UpdateTaskTCType, {
                                                                     dispatch,
                                                                     getState
                                                                   }) => {
  const state = getState() as AppRootStateType;
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

  return todolistsAPI.updateTask(todolistId, taskId, apiModel)
    .then(res => {
      if (res.data.resultCode === 0) {
        return {taskId, model: domainModel, todolistId}
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    })
})


const slice = createSlice({
  name: 'Tasks',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach(({id}) => {
        state[id] = []
      })
    })
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      const {todolistId, tasks} = action.payload
      state[todolistId].unshift(...tasks)
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      const {task} = action.payload
      state[task.todoListId].unshift(task)
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const {todolistId, taskId} = action.payload
      let taskIndex = state[todolistId].findIndex(({id}) => id === taskId)
      if (taskIndex !== -1) {
        state[todolistId].splice(taskIndex, 1)
      }
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      const {taskId, todolistId, model} = action.payload
      const tasks = state[todolistId]
      const taskIndex = state[todolistId].findIndex(({id}) => id === taskId)
      if (taskIndex !== -1) {
        tasks[taskIndex] = {...tasks[taskIndex], ...model}
      }
    })
  }
})

export const tasksReducer = slice.reducer
// export const {updateTaskAC} = slice.actions

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

import {TasksStateType} from '../App';
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType
} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK',
  todolistId: string
  taskId: string
}
export type AddTaskActionType = {
  type: 'ADD-TASK',
  task: TaskType
}
export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS',
  todolistId: string
  taskId: string
  status: TaskStatuses
}
export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE',
  todolistId: string
  taskId: string
  title: string
}
export type SetTasksActionType = {
  type: 'SET-TASKS'
  tasks: Array<TaskType>
  todolistId: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
  | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | SetTasksActionType

const initialState: TasksStateType = {
  /*"todolistId1": [
      { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
  ],
  "todolistId2": [
      { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
  ]*/

}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK': {
      const stateCopy = {...state}
      const tasks = stateCopy[action.todolistId];
      stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId);
      return stateCopy;
    }
    case 'ADD-TASK': {
      const stateCopy = {...state}

      const tasks = stateCopy[action.task.todoListId];
      stateCopy[action.task.todoListId] = [action.task, ...tasks];
      return stateCopy;
    }
    case 'CHANGE-TASK-STATUS': {
      let todolistTasks = state[action.todolistId];
      state[action.todolistId] = todolistTasks
        .map(t => t.id === action.taskId ? {...t, status: action.status} : t);
      return ({...state});
    }
    case 'CHANGE-TASK-TITLE': {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      state[action.todolistId] = todolistTasks
        .map(t => t.id === action.taskId ? {...t, title: action.title} : t);
      return ({...state});
    }
    case 'ADD-TODOLIST': {
      return {
        ...state, [action.item.id]: []
      }
    }
    case 'REMOVE-TODOLIST': {
      const copyState = {...state};
      delete copyState[action.id];
      return copyState;
    }
    case 'SET-TODOLISTS': {
      const stateCopy = {...state}
      action.todolists.forEach((tl) => {
        stateCopy[tl.id] = []
      })
      return stateCopy;
    }
    case 'SET-TASKS': {
      const stateCopy = {...state}
      stateCopy[action.todolistId] = action.tasks
      return stateCopy
    }
    default:
      return state;
  }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return {type: 'REMOVE-TASK', taskId, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
  return {type: 'ADD-TASK', task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
  return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
  return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
  return {type: 'SET-TASKS', tasks, todolistId}
}


export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI
    .getTasks(todolistId)
    .then((res) => {
      dispatch(setTasksAC(res.data.items, todolistId))
    })
}

export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  todolistsAPI
    .deleteTask(todolistId, taskId)
    .then((res) => {
      //there is no check error
      if (res.data.resultCode !== 0) throw Error('resultCode = 1')
      dispatch(removeTaskAC(taskId, todolistId))
    })
}

export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      dispatch(addTaskAC(res.data.data.item))
    })
}

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
      return t.id === taskId
    })

    if (task) {
      todolistsAPI.updateTask(todolistId, taskId, {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        description: task.description,
        deadline: task.deadline,
        status: status
      }).then(() => {
        const action = changeTaskStatusAC(taskId, status, todolistId)
        dispatch(action)
      })
    }
  }
}

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todolistId]
    const task = tasksForCurrentTodolist.find(t => {
      return t.id === taskId
    })

    if (task) {
      todolistsAPI.updateTask(todolistId, taskId, {
        ...task,
        title: title,
      }).then(() => {
        const action = changeTaskTitleAC(taskId, title, todolistId)
        dispatch(action)
      })
    }
  }
}



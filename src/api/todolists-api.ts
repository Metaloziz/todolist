import axios from "axios";

import { Paths } from "enums/enums";
import {
  GetTasksResponse,
  LoginParamsType,
  ResponseType,
  TaskType,
  TodolistType,
  UpdateTaskModelType
} from "types/TypesAPI";

const settings = {
  withCredentials: true,
  headers: {
    'API-KEY': process.env.REACT_APP_API_KEY,
  },
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  ...settings,
})

export const todoListsAPI = {
  getTodoLists() {
    return instance.get<TodolistType[]>(Paths.TodoList)
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>(Paths.TodoList, {
      title,
    })
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`${Paths.TodoList}/${id}`)
  },
  updateTodolist(id: string, title: string) {
    return instance.put<ResponseType>(`${Paths.TodoList}/${id}`, { title })
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(
      `${Paths.TodoList}/${todolistId}/${Paths.Tasks}`,
    )
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      `${Paths.TodoList}/${todolistId}/${Paths.Tasks}/${taskId}`,
    )
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `${Paths.TodoList}/${todolistId}/${Paths.Tasks}`,
      { title: taskTitile },
    )
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<TaskType>>(
      `${Paths.TodoList}/${todolistId}/${Paths.Tasks}/${taskId}`,
      model,
    )
  },
}

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>(Paths.AuthLogin, data)
  },
  logout() {
    return instance.delete<ResponseType<{ userId?: number }>>(Paths.AuthLogin)
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>(
      Paths.AuthMe,
    )
  },
}

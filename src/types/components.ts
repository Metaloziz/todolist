import { TaskStatuses } from 'enums'
import { FilterValuesType, TaskType, TodolistDomainType } from 'types'

export type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}
export type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
}
export type AppType = {
  demo?: boolean
}
export type FormikCallBackType = { email: string } | { password: string } | undefined
export type TaskPropsType = {
  task: TaskType
  todolistId: string
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
}
export type TodoListType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  demo?: boolean
}
export type TodoListsType = {
  demo: boolean | undefined
}

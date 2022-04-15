import { TaskPriorities, TaskStatuses } from 'enums'
import { TaskType } from 'types'

export type AddTaskTCType = {
  title: string
  todolistId: string
}
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type UpdateTaskTCType = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}

export type RemoveTaskTCType = {
  taskId: string
  todolistId: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

import { RequestStatusType, TodolistType } from 'types'

export type ChangeTodolistTitleTCType = {
  id: string
  title: string
}
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

import { RequestStatusType } from "types/appReducerType";
import { TodolistType } from "types/TypesAPI";

export type ChangeTodolistTitleTCType = {
  id: string
  title: string
}
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

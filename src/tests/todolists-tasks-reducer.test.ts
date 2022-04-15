import { IndexElement } from 'enums'
import { addTodolistTC, tasksReducer, todolistsReducer } from 'store'
import { TasksStateType, TodolistDomainType, TodolistType } from 'types'

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  const todolist: TodolistType = {
    title: 'new todolist',
    id: 'any id',
    addedDate: '',
    order: 0,
  }

  const action = addTodolistTC.fulfilled({ todolist }, '', todolist.title)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[IndexElement.First]
  const idFromTodolists = endTodolistsState[IndexElement.First].id

  expect(idFromTasks).toBe(action.payload?.todolist.id)
  expect(idFromTodolists).toBe(action.payload?.todolist.id)
})

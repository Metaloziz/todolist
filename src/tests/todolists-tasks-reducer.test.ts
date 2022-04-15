import { IndexElement } from "enums/enums";
import { tasksReducer } from "store/tasks-reducer";
import { addTodolistTC, todolistsReducer } from "store/todolists-reducer";
import { TasksStateType } from "types/tasksReducerType";
import { TodolistDomainType } from "types/todoListReducerType";
import { TodolistType } from "types/TypesAPI";

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

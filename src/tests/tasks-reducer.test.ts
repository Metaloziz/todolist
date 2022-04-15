import { CountItem, IndexElement, TaskPriorities, TaskStatuses } from "enums/enums";
import {
  addTaskTC,
  fetchTasksTC,
  removeTaskTC,
  tasksReducer,
  updateTaskTC
} from "store/tasks-reducer";
import {
  addTodolistTC,
  fetchTodolistsTC,
  removeTodolistTC
} from "store/todolists-reducer";
import { TasksStateType, UpdateTaskTCType } from "types/tasksReducerType";

let startState: TasksStateType = {}
let todolistId1: string
let todolistId2: string
let updateDateTask: UpdateTaskTCType
const todolistId1Length: number = 3
const todolistId2Length: number = 2
beforeEach(() => {
  updateDateTask = {
    taskId: '1',
    todolistId: todolistId2,
    domainModel: {
      status: TaskStatuses.Completed,
      title: 'waiter',
      description: 'deep',
      priority: TaskPriorities.Hi,
      startDate: '',
      deadline: '',
    },
  }

  startState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: todolistId1,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: todolistId1,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: todolistId1,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: todolistId2,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: todolistId2,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: todolistId2,
        description: '',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  }
  todolistId1 = 'todolistId1'
  todolistId2 = 'todolistId2'
})

describe('task-reducer', () => {
  test('correct task should be deleted from correct array', () => {
    const data = {
      taskId: '2',
      todolistId: todolistId2,
    }

    const action = removeTaskTC.fulfilled(data, '', data)

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(todolistId1Length)
    expect(endState[todolistId2].length).toBe(todolistId2Length)
    expect(endState[todolistId2].every(t => t.id !== '2')).toBeTruthy()
  })
  test('correct task should be added to correct array', () => {
    const title = 'juce'
    const data = {
      task: {
        todoListId: todolistId2,
        title,
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exists',
      },
    }
    const action = addTaskTC.fulfilled(data, '', { title, todolistId: todolistId2 })

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1].length).toBe(todolistId1Length)
    expect(endState[todolistId2].length).toBe(todolistId2Length + todolistId2Length)
    expect(endState[todolistId2][IndexElement.First].id).toBeDefined()
    expect(endState[todolistId2][IndexElement.First].title).toBe(title)
    expect(endState[todolistId2][IndexElement.First].status).toBe(TaskStatuses.New)
  })
  test('status of specified task should be changed', () => {
    const data = {
      taskId: '2',
      model: { status: TaskStatuses.New },
      todolistId: todolistId2,
    }
    const action = updateTaskTC.fulfilled(data, '', updateDateTask)

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1][IndexElement.Second].status).toBe(TaskStatuses.Completed)
    expect(endState[todolistId2][IndexElement.Second].status).toBe(TaskStatuses.New)
  })
  test('title of specified task should be changed', () => {
    const action = updateTaskTC.fulfilled(
      {
        taskId: '2',
        model: { title: 'yogurt' },
        todolistId: todolistId2,
      },
      '',
      updateDateTask,
    )

    const endState = tasksReducer(startState, action)

    expect(endState[todolistId1][IndexElement.Second].title).toBe('JS')
    expect(endState[todolistId2][IndexElement.Second].title).toBe('yogurt')
    expect(endState[todolistId2][IndexElement.First].title).toBe('bread')
  })
  test('new array should be added when new todolist is added', () => {
    const newTodoList = {
      todolist: {
        id: 'blabla',
        title: 'new todolist',
        order: 0,
        addedDate: '',
      },
    }

    const action = addTodolistTC.fulfilled(newTodoList, '', newTodoList.todolist.title)

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== todolistId1 && k !== todolistId2)
    if (!newKey) {
      throw Error('new key should be added')
    }

    expect(keys.length).toBe(todolistId1Length)
    expect(endState[newKey]).toEqual([])
  })
  test('property with todolistId should be deleted', () => {
    const action = removeTodolistTC.fulfilled({ id: todolistId2 }, '', todolistId2)

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(todolistId1Length - todolistId2Length)
    expect(endState[todolistId2]).not.toBeDefined()
  })
  test('empty arrays should be added when we set todolists', () => {
    const todoLists = {
      todolists: [
        { id: '1', title: 'title 1', order: 0, addedDate: '' },
        { id: '2', title: 'title 2', order: 0, addedDate: '' },
      ],
    }

    const action = fetchTodolistsTC.fulfilled(todoLists, '')

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(todolistId2Length)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
  })
  test('tasks should be added for todolist', () => {
    const action = fetchTasksTC.fulfilled(
      {
        tasks: startState[todolistId1],
        todolistId: todolistId1,
      },
      '',
      todolistId1,
    )

    const endState = tasksReducer(
      {
        todolistId2: [],
        todolistId1: [],
      },
      action,
    )

    expect(endState[todolistId1].length).toBe(todolistId1Length)
    expect(endState[todolistId2].length).toBe(CountItem.Zero)
  })
})

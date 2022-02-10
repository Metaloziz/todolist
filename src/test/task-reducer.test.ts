import {
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer
} from "../state/tasks-reducer";
import {TasksStateType} from "../App";
import {
  addTodolistAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  TodolistDomainType,
  todolistsReducer
} from "../state/todolists-reducer";
import {TaskPriorities, TaskStatus} from "../api/todolist-api";


export {}


let startState: TasksStateType

const todolistID_1 = 'todolistId1'
const todolistID_2 = 'todolistId2'

beforeEach(() => {
    startState = {
      [todolistID_1]: [
        {
          id: "1",
          title: "CSS",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_1
        },
        {
          id: "2",
          title: "JS",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_1
        },
        {
          id: "3",
          title: "React",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_1
        },
      ],
      [todolistID_2]: [
        {
          id: "1",
          title: "bread",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_2
        },
        {
          id: "2",
          title: "milk",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_2
        },
        {
          id: "3",
          title: "tea",
          status: TaskStatus.New,
          completed: false,
          deadline: new Date(),
          startDate: new Date(),
          addedDate: new Date(),
          priority: TaskPriorities.Middle,
          description: '',
          order: 0,
          todoListId: todolistID_2
        },
      ]
    };
  }
)


test('correct task should be added to correct array', () => {

  const action = addTaskAC("juice", todolistID_2);

  const endState = tasksReducer(startState, action)

  expect(startState).not.toBe(endState)
  expect(endState[todolistID_1].length).toBe(3);
  expect(endState[todolistID_2].length).toBe(4);
  expect(endState[todolistID_2][0].id).toBeDefined();
  expect(endState[todolistID_2][0].title).toBe("juice");
  expect(endState[todolistID_2][0].status).toBe(TaskStatus.InProgress);

})

test('correct task should be deleted from correct array', () => {

  const action = removeTaskAC("2", todolistID_2);

  const endState = tasksReducer(startState, action)

  expect(startState).not.toBe(endState)
  expect(endState[todolistID_2].length).toBe(2);
  expect(endState[todolistID_2].find(el => el.id === "2")).toBeUndefined()
  expect(endState[todolistID_1].length).toBe(3);

})

test('status of specified task should be changed', () => {

  const action = changeTaskStatusAC("2", TaskStatus.InProgress, todolistID_2);

  const endState = tasksReducer(startState, action)

  expect(startState).not.toBe(endState)
  expect(endState[todolistID_2][1].status).toBe(TaskStatus.InProgress);
  expect(endState[todolistID_1][1].status).toBe(TaskStatus.New);
});

test('title of specified task should be changed', () => {

  const action = changeTaskTitleAC("2", "newTitle", todolistID_2);

  const endState = tasksReducer(startState, action)

  expect(startState).not.toBe(endState)
  expect(endState[todolistID_2][1].title).toBe("newTitle");
  expect(endState[todolistID_1][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {


  const action = addTodolistAC("new todolist");

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);
  const newKey = keys.find(k => k !== todolistID_1 && k !== todolistID_2);
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(startState).not.toBe(endState)
  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: TodolistDomainType[] = [];

  const action = addTodolistAC("new todolist");

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todolistId);
  expect(idFromTodolists).toBe(action.todolistId);
});

test('property with todolistId should be deleted', () => {

  const action = removeTodolistAC(todolistID_2);

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState[todolistID_2]).not.toBeDefined();
});

test('change title', () => {

  const initialState: TodolistDomainType[] = [{
    id: todolistID_1,
    order: 0,
    addedDate: 'today',
    title: 'Title 1',
    filter: "all",
  }]
  let action = changeTodolistTitleAC(todolistID_1, 'newTitle')

  let endState = todolistsReducer(initialState, action)

  expect(initialState).not.toBe(endState)
  expect(endState[0].title).toBe('newTitle')
  expect(initialState[0].title).toBe('Title 1')

})

























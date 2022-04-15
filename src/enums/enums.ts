export enum Paths {
  TodoList = 'todo-lists',
  Tasks = 'tasks',
  AuthLogin = 'auth/login',
  AuthMe = 'auth/me',
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export enum KeyCharCode {
  Enter = 13,
}

export enum TasksFilter {
  Completed = 'completed',
  Active = 'active',
  All = 'all',
}

export enum StatusCode {
  Success = 0,
}

export enum FindIndex {
  NotSuccess = -1,
}

export enum CountItem {
  Zero = 0,
  One = 1,
}

export enum StatusToDoList {
  First = 0,
}

export enum PriorityToDoList {
  First = 0,
}

export enum IndexElement {
  First = 0,
  Second = 1,
}

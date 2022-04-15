import React, { FC, useEffect, useState } from "react";

import { todoListsAPI } from "api/todolists-api";
import { PriorityToDoList, StatusToDoList } from "enums/enums";

export const GetTodolists: FC = () => {
  const [state, setState] = useState<any>(null)

  useEffect(() => {
    todoListsAPI.getTodoLists().then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist: FC = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todoListsAPI.createTodolist('blabla todolist').then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist: FC = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = '0da4eca9-b11b-416f-ac61-ecf3b195e25c'
    todoListsAPI.deleteTodolist(todolistId).then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle: FC = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = '1490c9b5-19c9-44a8-bc18-5ca4f1597cfa'
    todoListsAPI.updateTodolist(todolistId, 'Dimych hello').then(res => {
      setState(res.data)
    })
  }, [])

  return <div> {JSON.stringify(state)}</div>
}

export const GetTasks: FC = () => {
  const [state, setState] = useState<any>(null)
  const [todolistId, setTodolistId] = useState<string>('')

  const getTasks = (): void => {
    todoListsAPI.getTasks(todolistId).then(res => {
      setState(res.data)
    })
  }

  return (
    <div>
      {' '}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder="todolistId"
          value={todolistId}
          onChange={e => {
            setTodolistId(e.currentTarget.value)
          }}
        />

        <button type="button" onClick={getTasks}>
          get tasks
        </button>
      </div>
    </div>
  )
}

export const DeleteTask: FC = () => {
  const [state, setState] = useState<any>(null)
  const [taskId, setTaskId] = useState<string>('')
  const [todolistId, setTodolistId] = useState<string>('')

  const deleteTask = (): void => {
    todoListsAPI.deleteTask(todolistId, taskId).then(res => {
      setState(res.data)
    })
  }

  return (
    <div>
      {' '}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder="todolistId"
          value={todolistId}
          onChange={e => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder="taskId"
          value={taskId}
          onChange={e => {
            setTaskId(e.currentTarget.value)
          }}
        />
        <button type="button" onClick={deleteTask}>
          delete task
        </button>
      </div>
    </div>
  )
}

export const CreateTask: FC = () => {
  const [state, setState] = useState<any>(null)
  const [taskTitle, setTaskTitle] = useState<string>('')
  const [todolistId, setTodolistId] = useState<string>('')

  const createTask = (): void => {
    todoListsAPI.createTask(todolistId, taskTitle).then(res => {
      setState(res.data)
    })
  }

  return (
    <div>
      {' '}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder="todolistId"
          value={todolistId}
          onChange={e => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder="Task Title"
          value={taskTitle}
          onChange={e => {
            setTaskTitle(e.currentTarget.value)
          }}
        />
        <button type="button" onClick={createTask}>
          create task
        </button>
      </div>
    </div>
  )
}

export const UpdateTask: FC = () => {
  const [state, setState] = useState<any>(null)
  const [title, setTitle] = useState<string>('title 1')
  const [description, setDescription] = useState<string>('description 1')
  const [status, setStatus] = useState<number>(StatusToDoList.First)
  const [priority, setPriority] = useState<number>(PriorityToDoList.First)

  const [todolistId, setTodolistId] = useState<string>('')
  const [taskId, setTaskId] = useState<string>('')

  const createTask = (): void => {
    todoListsAPI
      .updateTask(todolistId, taskId, {
        deadline: '',
        description,
        priority,
        startDate: '',
        status,
        title,
      })
      .then(res => {
        setState(res.data)
      })
  }

  return (
    <div>
      {' '}
      {JSON.stringify(state)}
      <div>
        <input
          placeholder="taskId"
          value={taskId}
          onChange={e => {
            setTaskId(e.currentTarget.value)
          }}
        />
        <input
          placeholder="todolistId"
          value={todolistId}
          onChange={e => {
            setTodolistId(e.currentTarget.value)
          }}
        />
        <input
          placeholder="Task Title"
          value={title}
          onChange={e => {
            setTitle(e.currentTarget.value)
          }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={e => {
            setDescription(e.currentTarget.value)
          }}
        />
        <input
          placeholder="status"
          value={status}
          type="number"
          onChange={e => {
            setStatus(+e.currentTarget.value)
          }}
        />
        <input
          placeholder="priority"
          value={priority}
          type="number"
          onChange={e => {
            setPriority(+e.currentTarget.value)
          }}
        />
        <button type="button" onClick={createTask}>
          update task
        </button>
      </div>
    </div>
  )
}

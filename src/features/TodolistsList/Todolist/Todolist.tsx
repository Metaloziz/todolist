import React, { FC, memo, useCallback, useEffect } from "react";

import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useDispatch } from "react-redux";

import { Task } from "./Task/Task";

import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { TasksFilter, TaskStatuses } from "enums/enums";
import { fetchTasksTC } from "store/tasks-reducer";
import { TodoListType } from "types/components";

export const Todolist: FC<TodoListType> = memo(({ demo = false, ...props }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (demo) {
      return
    }
    const thunk = fetchTasksTC(props.todolist.id)
    dispatch(thunk)
  }, [])

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.todolist.id)
    },
    [props.addTask, props.todolist.id],
  )

  const removeTodolist = (): void => {
    props.removeTodolist(props.todolist.id)
  }
  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.todolist.id, title)
    },
    [props.todolist.id, props.changeTodolistTitle],
  )

  const onAllClickHandler = useCallback(
    () => props.changeFilter(TasksFilter.All, props.todolist.id),
    [props.todolist.id, props.changeFilter],
  )
  const onActiveClickHandler = useCallback(
    () => props.changeFilter(TasksFilter.Active, props.todolist.id),
    [props.todolist.id, props.changeFilter],
  )
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter(TasksFilter.Completed, props.todolist.id),
    [props.todolist.id, props.changeFilter],
  )

  let tasksForTodolist = props.tasks

  if (props.todolist.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (props.todolist.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton
          onClick={removeTodolist}
          disabled={props.todolist.entityStatus === 'loading'}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        addItem={addTask}
        disabled={props.todolist.entityStatus === 'loading'}
      />
      <div>
        {tasksForTodolist.map(t => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
            removeTask={props.removeTask}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Button
          variant={props.todolist.filter === TasksFilter.All ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
          color="default"
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === TasksFilter.Active ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          color="primary"
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === TasksFilter.Completed ? 'outlined' : 'text'}
          onClick={onCompletedClickHandler}
          color="secondary"
        >
          Completed
        </Button>
      </div>
    </div>
  )
})

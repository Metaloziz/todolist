import React, { FC, useCallback, useEffect } from "react";

import { Grid, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { Todolist } from "./Todolist/Todolist";

import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { TaskStatuses } from "enums/enums";
import { AppRootStateType } from "store/store";
import { addTaskTC, removeTaskTC, updateTaskTC } from "store/tasks-reducer";
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  removeTodolistTC
} from "store/todolists-reducer";
import { TodoListsType } from "types/components";
import { TasksStateType } from "types/tasksReducerType";
import { FilterValuesType, TodolistDomainType } from "types/todoListReducerType";

export const TodoLists: FC<TodoListsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    state => state.todolists,
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    state => state.auth.isLoggedIn,
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    const thunk = fetchTodolistsTC()
    dispatch(thunk)
  }, [demo, dispatch, isLoggedIn])

  const removeTask = useCallback(
    (taskId: string, todolistId: string) => {
      const thunk = removeTaskTC({ taskId, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const addTask = useCallback(
    (title: string, todolistId: string) => {
      const thunk = addTaskTC({ title, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeStatus = useCallback(
    (taskId: string, status: TaskStatuses, todolistId: string) => {
      const thunk = updateTaskTC({ taskId, domainModel: { status }, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeTaskTitle = useCallback(
    (taskId: string, title: string, todolistId: string) => {
      const thunk = updateTaskTC({ taskId, domainModel: { title }, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeFilter = useCallback(
    (value: FilterValuesType, todolistId: string) => {
      const action = changeTodolistFilterAC({ id: todolistId, filter: value })
      dispatch(action)
    },
    [dispatch],
  )

  const removeTodolist = useCallback(
    (id: string) => {
      const thunk = removeTodolistTC(id)
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      const thunk = changeTodolistTitleTC({ id, title })
      dispatch(thunk)
    },
    [dispatch],
  )

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title)
      dispatch(thunk)
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          const allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '10px' }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

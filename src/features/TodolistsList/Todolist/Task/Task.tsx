import React, { ChangeEvent, FC, memo, useCallback } from 'react'

import { Checkbox, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

import { EditableSpan } from 'components/EditableSpan/EditableSpan'
import { TaskStatuses } from 'enums/enums'
import { TaskPropsType } from 'types/components'

export const Task: FC<TaskPropsType> = memo(
  ({ task, removeTask, todolistId, changeTaskStatus, changeTaskTitle }) => {
    const onClickHandler = useCallback(
      () => removeTask(task.id, todolistId),
      [task.id, todolistId, removeTask],
    )

    const onChangeHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newIsDoneValue = e.currentTarget.checked
        changeTaskStatus(
          task.id,
          newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
          todolistId,
        )
      },
      [task.id, todolistId, changeTaskStatus],
    )

    const onTitleChangeHandler = useCallback(
      (newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId)
      },
      [task.id, todolistId, changeTaskTitle],
    )

    return (
      <div
        key={task.id}
        className={task.status === TaskStatuses.Completed ? 'is-done' : ''}
      >
        <Checkbox
          checked={task.status === TaskStatuses.Completed}
          color='primary'
          onChange={onChangeHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
        <IconButton onClick={onClickHandler}>
          <Delete />
        </IconButton>
      </div>
    )
  },
)

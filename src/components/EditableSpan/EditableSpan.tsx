import React, { ChangeEvent, memo, useState } from "react";

import { TextField } from "@material-ui/core";

import { EditableSpanPropsType } from "types/components";

export const EditableSpan = memo((props: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(props.value)

  const activateEditMode = (): void => {
    setEditMode(true)
    setTitle(props.value)
  }
  const activateViewMode = (): void => {
    setEditMode(false)
    props.onChange(title)
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
  ) : (
    <span onDoubleClick={activateEditMode}>{props.value}</span>
  )
})

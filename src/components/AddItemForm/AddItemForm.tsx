import React, { ChangeEvent, FC, KeyboardEvent, memo, useState } from "react";

import { IconButton, TextField } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";

import { KeyCharCode } from "enums/enums";
import { AddItemFormPropsType } from "types/components";

export const AddItemForm: FC<AddItemFormPropsType> = memo(
  ({ addItem, disabled = false }) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addItemHandler = (): void => {
      if (title.trim() !== '') {
        addItem(title)
        setTitle('')
      } else {
        setError('Title is required')
      }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>): void => {
      setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>): void => {
      if (error !== null) {
        setError(null)
      }
      if (e.charCode === KeyCharCode.Enter) {
        addItemHandler()
      }
    }

    return (
      <div>
        <TextField
          variant="outlined"
          disabled={disabled}
          error={!!error}
          value={title}
          onChange={onChangeHandler}
          onKeyPress={onKeyPressHandler}
          label="Title"
          helperText={error}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
          <AddBox />
        </IconButton>
      </div>
    )
  },
)

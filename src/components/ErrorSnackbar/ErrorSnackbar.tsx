import React, { FC } from "react";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";

import { setAppErrorAC } from "store/app-reducer";
import { errorSnackbarSelector } from "utils/selectors";

const Alert: FC<AlertProps> = props => (
  <MuiAlert elevation={6} variant="filled" {...props} />
)

export const ErrorSnackbar: FC = () => {
  const error = useSelector(errorSnackbarSelector)
  const dispatch = useDispatch()

  const handleClose = (event?: React.SyntheticEvent, reason?: string): void => {
    if (reason === 'click away') {
      return
    }
    dispatch(setAppErrorAC({ error: null }))
  }

  const isOpen = error !== null

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  )
}

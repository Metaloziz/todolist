import React, {useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {appErrorAC} from "../../app/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props, ref) {
  return <MuiAlert elevation={6}
                   ref={ref}
                   variant="filled"
                   {...
                     props
                   }
  />;
});

export const ErrorSnackbar = () => {


  const error = useSelector<AppRootStateType, string | null>(state => state.app.error)

  const [open, setOpen] = useState(true);
  const dispatch = useDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    dispatch(appErrorAC(null))
  };

  return (
    <Snackbar open={!!error}
              autoHideDuration={6000}
              onClose={handleClose}>
      <Alert onClose={handleClose}
             severity="error"
             sx={
               {
                 width: '100%'
               }
             }>
        {error}
      </Alert>
    </Snackbar>
  );
};
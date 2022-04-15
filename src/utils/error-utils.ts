import { setAppErrorAC, setAppStatusAC } from "store/app-reducer";
import { Dispatch } from "redux";
import { ResponseType } from "types/TypesAPI";
import { SetAppErrorActionType, SetAppStatusActionType } from "types/appReducerType";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({error: data.messages[0]}))
  } else {
    dispatch(setAppErrorAC({error: 'Some error occurred'}))
  }
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
  dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
  dispatch(setAppStatusAC({status: 'failed'}))
}

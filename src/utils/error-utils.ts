import { Dispatch } from 'redux'

import { IndexElement } from 'enums'
import { setAppErrorAC, setAppStatusAC } from 'store'
import { ResponseType, SetAppErrorActionType, SetAppStatusActionType } from 'types'

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
): void => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[IndexElement.First] }))
  } else {
    dispatch(setAppErrorAC({ error: 'Some error occurred' }))
  }
  dispatch(setAppStatusAC({ status: 'failed' }))
}

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
): void => {
  dispatch(
    setAppErrorAC({ error: error.message ? error.message : 'Some error occurred' }),
  )
  dispatch(setAppStatusAC({ status: 'failed' }))
}

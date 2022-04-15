import { AppRootStateType } from 'store'

export const errorSnackbarSelector = (state: AppRootStateType): string | null =>
  state.app.error

export const loginSelector = (state: AppRootStateType): boolean => state.auth.isLoggedIn

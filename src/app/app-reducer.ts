export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType,
  error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case "APP/SET-ERROR":
      return {...state, error: action.error}
    default:
      return state
  }
}


export const appLoadingAC = (status: RequestStatusType) => ({
  type: 'APP/SET-STATUS',
  status,
} as const)

export const appErrorAC = (error: string | null) => ({
  type: 'APP/SET-ERROR',
  error,
} as const)

// export type appLoadingACType = ReturnType<typeof appLoadingAC>

export type AppActionsType =
  ReturnType<typeof appLoadingAC>
  | ReturnType<typeof appErrorAC>

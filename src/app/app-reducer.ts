export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
  status: 'loading' as RequestStatusType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    default:
      return state
  }
}


export const appLoadingAC = (status: RequestStatusType) => ({
  type: 'APP/SET-STATUS',
  status,
} as const)

export type appLoadingACType = ReturnType<typeof appLoadingAC>

export type AppActionsType = appLoadingACType

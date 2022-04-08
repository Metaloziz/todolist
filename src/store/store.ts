import {tasksReducer} from 'store/tasks-reducer';
import {todolistsReducer} from 'store/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from 'store/app-reducer'
import {authReducer} from 'store/auth-reducer'
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware)
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

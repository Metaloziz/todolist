import React, {useCallback, useEffect} from 'react'
import './App.css'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from 'features/TodolistsList/TodolistsList'
import {ErrorSnackbar} from 'components/ErrorSnackbar/ErrorSnackbar'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from 'store/store'
import {initializeAppTC, RequestStatusType} from 'store/app-reducer'
import {Navigate, Route, Routes} from 'react-router-dom'
import {Login} from 'features/Login/Login'
import {logoutTC} from 'store/auth-reducer'


type PropsType = {
  demo?: boolean
}

function App({demo = false}: PropsType) {
  const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
  const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
  const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAppTC({isInitialized: true}))
  }, [dispatch])

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC())
  }, [dispatch])

  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }

  return (
    <div className="App">
      <ErrorSnackbar/>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu/>
          </IconButton>
          <Typography variant="h6">
            Todolist
          </Typography>
          {isLoggedIn &&
            <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
        </Toolbar>
        {status === 'loading' && <LinearProgress/>}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
          <Route path="*" element={<Navigate to="/404"/>}/>
        </Routes>
      </Container>
    </div>
  )
}

export default App

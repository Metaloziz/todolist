import React, {useEffect, useState} from 'react'
import axios from "axios";


export default {
    title: 'API',
}

// withCredentials определяет, должны ли межсайтовые (кроссдоменные) запросы
// выполняться с использованием учетных данных (cookie)

type ToDoList = {
    id: string
    title: string
    addedDate: Date
    order: number
}


const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '90693c4a-358e-42c0-a191-4a11d81072dd'
    }
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {

        axios.get<ToDoList[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', setting)
            .then((res) => {
                setState(res.data)
            })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)


    useEffect(() => {

        let title = "EEEEEEEEEEEEEEEEE"

        axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, setting)
            .then((res) => {
                setState(res.data)
            })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)


    useEffect(() => {

        let listID = "ff65ed8a-c6d9-4738-a66c-5d8fee5a9e87"

        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${listID}`, setting)
            .then((res) => {
                setState(res.data)
            })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {

        let listID = "0195f7cc-13d6-4534-8de7-47a721800ba3"
        let title = "AAAAAAAAAAAAAAAA"

        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${listID}`, {title}, setting)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

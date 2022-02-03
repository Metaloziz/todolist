import React, {useEffect, useState} from 'react'
import axios from "axios";


const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '8d4460ed-ca35-4d52-9e10-986044b2de1a'
    }
}

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {

        axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    let newToDoList = {title: 'newList'}

    useEffect(() => {
        axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', newToDoList, settings)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    let titleID = "b9bea611-ccb3-4bbd-aca5-88f1c9fd8724"

    useEffect(() => {
        axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${titleID}`, settings)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        let titleID = "764526c9-933e-4c88-8336-320d61d61a69"

        let body = {title: 'new title111111111111'}

        axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${titleID}`, body, settings)
            .then((res) => {
                setState(res.data);
            })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}

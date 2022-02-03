import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";


export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {

        todolistAPI.getTodos().then((res) => {
            setState(res.data);
        })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    let newToDoListTitle = 'newList'

    useEffect(() => {

        todolistAPI.createTodo(newToDoListTitle).then((res) => {
            setState(res.data);
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)

    let listID = "b9bea611-ccb3-4bbd-aca5-88f1c9fd8724"

    useEffect(() => {
        todolistAPI.deleteTodo(listID)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {

        let listID = "764526c9-933e-4c88-8336-320d61d61a69"

        let newTitle = 'new title111111111111'

        todolistAPI.updateTodoTitle(listID, newTitle).then((res) => {
            setState(res.data);
        })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}

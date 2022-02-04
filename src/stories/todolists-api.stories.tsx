import React, {ChangeEvent, useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";


export default {
    title: 'API',
}

// withCredentials определяет, должны ли межсайтовые (кроссдоменные) запросы
// выполняться с использованием учетных данных (cookie)


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {

        todolistAPI.getTodolists()
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

        todolistAPI.createTodolist(title)
            .then((res) => {
                setState(res.data)
            })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [ID, setID] = useState<string>('null')


    const localCallBack = (event: ChangeEvent<HTMLInputElement>) => {
        setID(event.currentTarget.value)
    }
    const callBack = () => {

        todolistAPI.deleteTodolist(ID)
            .then((res) => {
                setState(res.data)

            }).catch((rej) => {
            setState(rej.response)
        })

    }

    return <div> {JSON.stringify(state)}
        <div>
            <input type={"text"} onChange={localCallBack}/>
            <button onClick={callBack}>delete</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [listID, setlistID] = useState<string>('')
    const [listTitle, setlistTitle] = useState<string>('')

    const setIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        setlistID(event.currentTarget.value)
    }

    const setTitleCB = (event: ChangeEvent<HTMLInputElement>) => {
        setlistTitle(event.currentTarget.value)
    }

    const callBack = () => {

        todolistAPI.updateTodolistTitle(listID, listTitle)
            .then((res) => {
                setState(res.data)
            }).catch((rej) => {
            setState(rej.response.data)
        })
    }

    return <div> {JSON.stringify(state)}
        <div>
            <div><label><input type={"text"} onChange={setTitleCB}/>Title</label></div>
            <div><label><input type={"text"} onChange={setIDCB}/>ID</label></div>
            <button onClick={callBack}>update</button>
        </div>
    </div>
}

import React, {ChangeEvent, useEffect, useState} from 'react'
import {TaskType, todolistAPI, TodoListType} from "../api/todolist-api";


export default {
    title: 'API',
}

// withCredentials определяет, должны ли межсайтовые (кроссдоменные) запросы
// выполняться с использованием учетных данных (cookie)

export const GetTodolists = () => {
    const [state, setState] = useState<TodoListType[]>([])

    useEffect(() => {

        todolistAPI.getTodolists()
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div>{state.map(el => <div>{JSON.stringify(el)}
        <hr/>
    </div>)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        let title = "EEEEEEEEEEEEEEEEE"
        todolistAPI.createTodolist(title)
            .then((res) => {
                setState(res.data.data.item)
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

/// tasks

export const GetTasks = () => {
    const [state, setState] = useState<TaskType[]>([])
    const [listID, setListID] = useState<string>('')

    const callBack = () => {
        todolistAPI.getTasks(listID)
            .then((res) => {
                setState(res.data.items)
            })
    }

    const setIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        setListID(event.currentTarget.value)
    }

    return <div>
        <div>
            <label><input type={"text"} onChange={setIDCB}/>listID</label>
            <div>
                <button onClick={callBack}>get</button>
            </div>
            <div> {state.map(el => <div>{JSON.stringify(el)}<hr/></div>)}</div>
        </div>
    </div>
}

export const PostTask = () => {
    const [state, setState] = useState<any>(null)
    const [listID, setlistID] = useState<string>('')

    const callBack = () => {
        todolistAPI.postTask(listID, 'new taskTitle')
            .then((response) => {
                setState(response.data.data.item)
            })
    }

    const setIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        setlistID(event.currentTarget.value)
    }

    return <div>
        <div>
            <label><input type={"text"} onChange={setIDCB}/>listID</label>
            <div>
                <button onClick={callBack}>post</button>
            </div>
            <div>{JSON.stringify(state)}</div>
        </div>
    </div>
}

export const PutTask = () => {
    const [state, setState] = useState<any>(null)
    const [listID, setListID] = useState<string>('ef1523d6-b657-4497-9742-afe9e1935b0f')
    const [taskID, setTaskID] = useState<string>('1a4963bf-0bcd-48ef-a200-444181d44ee5')
    const [title, setTitle] = useState<string>('')

    const callBack = () => {
        todolistAPI.putTask(listID, taskID,title)
            .then((response) => {
                setState(response.data)
            }).catch((error)=>{
            setState(error)
        })
    }

    const setListIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        // setListID(event.currentTarget.value)
    }
    const setTaskIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        // setTaskID(event.currentTarget.value)
    }
    const setTitleIDCB = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    return <div>
        <div>
            <div><input type={"text"} value={listID} onChange={setListIDCB}/>listID</div>
            <div><input type={"text"} value={taskID} onChange={setTaskIDCB}/>TaskID</div>
            <div><input type={"text"} value={title} onChange={setTitleIDCB}/>Title</div>
            <div>
                <button onClick={callBack}>put</button>
            </div>
            <div>{JSON.stringify(state)}</div>
        </div>
    </div>
}
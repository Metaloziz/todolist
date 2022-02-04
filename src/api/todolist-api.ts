import axios from "axios";
import {
    CreateTodolist,
    DeleteTodolist,
    UpdateTodolistTitle
} from "../stories/todolists-api.stories";

export {}

const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '90693c4a-358e-42c0-a191-4a11d81072dd'
    }
}


type ToDoList = {
    id: string
    title: string
    addedDate: Date
    order: number
}

type todolistAPIType = {
    detTodolists: () => Promise<any>
    createTodolist: (title: string) => Promise<any>
    deleteTodolist: (listID: string) => Promise<any>
    updateTodolistTitle: (listID: string, title: string) => Promise<any>
}


export const todolistAPI: todolistAPIType = {
    detTodolists: () => {
        return axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists', setting)
    },

    createTodolist: (title) => {
        return axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, setting)
    },
    deleteTodolist: (listID) => {
        return axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${listID}`, setting)
    },
    updateTodolistTitle: (listID, title) => {
        return axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${listID}`, {title}, setting)
    }
}
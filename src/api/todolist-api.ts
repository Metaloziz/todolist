import axios from "axios";

const instance = axios.create({
        baseURL: 'https://social-network.samuraijs.com/api/1.1',
        headers: {
            'API-KEY': '8d4460ed-ca35-4d52-9e10-986044b2de1a',
        },
        withCredentials: true
    }
)

export const todolistAPI = {

    getTodos() {
        return instance.get('/todo - lists')
    },

    createTodo(title: string) {
        return instance.post('/todo-lists', {title})
    },

    deleteTodo(listID: string) {
        return instance.delete(`/todo-lists/${listID}`)
    },

    updateTodoTitle(listID: string, title: string) {
        return instance.put(`/todo-lists/${listID}`, {title})
    }
}
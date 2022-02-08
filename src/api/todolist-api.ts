import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const setting = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '90693c4a-358e-42c0-a191-4a11d81072dd'
    }
})

type CreateTodoListType = {
    item: TodoListType
}

export type TodoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type CommonType<T = {}> = {
    data: T
    fieldsErrors: []
    messages: []
    resultCode: 0
}

// type todolistAPIType = {
//     getTodolists: () => Promise<AxiosResponse<TodoListType[]>>
//     createTodolist: (title: string) => Promise<any>
//     deleteTodolist: (listID: string) => Promise<any>
//     updateTodolistTitle: (listID: string, title: string) => Promise<any>
// }


type GetTasksType = {
    items: TaskType[]
    totalCount: number
    error: string
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type PostTaskResponseType = {
    item: TaskType
}

export const todolistAPI = {
    getTodolists: () => {
        return setting.get<TodoListType[], AxiosResponse<TodoListType[]>>('/todo-lists')
    },
    createTodolist: (title: string) => {
        return setting.post <CommonType<CreateTodoListType>,
            AxiosResponse<CommonType<CreateTodoListType>>,
            { title: string }>('/todo-lists', {title: title})
    },
    deleteTodolist: (listID: string) => {
        return setting.delete<CommonType, AxiosResponse<CommonType>>(`/todo-lists/${listID}`)
    },
    updateTodolistTitle: (listID: string, title: string) => {
        return setting.put<CommonType, AxiosResponse<CommonType>, { title: string }>(`/todo-lists/${listID}`, {title})
    },

    getTasks: (listID: string) => {
        return setting.get<GetTasksType, AxiosResponse<GetTasksType>>(`/todo-lists/${listID}/tasks`)
    },
    postTask: (listID: string, value: string) => {
        return setting.post<CommonType<PostTaskResponseType>,
            AxiosResponse<CommonType<PostTaskResponseType>>,
            { title: string }>(`/todo-lists/${listID}/tasks`, {title: value})
    }
}
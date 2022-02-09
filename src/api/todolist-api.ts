import axios, {AxiosResponse} from "axios";


type CreateTodoListType = {
    item: TodolistType
}

export type TodolistType = {
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

export enum TaskStatus {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}


export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatus
    priority: TaskPriorities
    startDate: Date
    deadline: Date
    id: string
    todoListId: string
    order: number
    addedDate: Date
}

type TaskResponseType = {
    item: TaskType
}


const setting = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '90693c4a-358e-42c0-a191-4a11d81072dd'
    }
})

export const todolistAPI = {
    getTodolists: () => {
        return setting.get<TodolistType[], AxiosResponse<TodolistType[]>>('/todo-lists')
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
        return setting.post<CommonType<TaskResponseType>,
            AxiosResponse<CommonType<TaskResponseType>>,
            { title: string }>(`/todo-lists/${listID}/tasks`, {title: value})
    },

    putTask: (listID: string, taskId: string, title: string) => {

        let changedTask: TaskType = {
            id: taskId,
            title: title,
            completed: false,
            deadline: new Date(),
            description: 'some text',
            priority: 1,
            startDate: new Date(),
            addedDate: new Date(),
            order: 1,
            todoListId: listID,
            status: 0
        }

        return setting.put<CommonType<TaskResponseType>,
            AxiosResponse<CommonType<TaskResponseType>>,
            TaskType>(`/todo-lists/${listID}/tasks/${taskId}`, changedTask)
    },
    deleteTask: (listID: string, taskId: string) => {
        return setting.delete<CommonType, AxiosResponse<CommonType>>(`/todo-lists/${listID}/tasks/${taskId}`)
    }
}
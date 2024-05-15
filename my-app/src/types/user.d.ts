declare module 'user' {
    export interface User {
        userId: number
        firstName: string
        lastName: string
        email: string
    }

    export interface UserAuth {
        userId: number
        token: string
        loggedIn: boolean
    }
}

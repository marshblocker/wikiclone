export interface User {
    user_id: string;
    requiredInfo: UserRequiredInfo;
    role: string;
    can_edit: boolean
}

export interface UserPublic {
    user_id: string;
    username: string;
    email: string;
    role: string;
    can_edit: boolean
}

export interface UserRequiredInfo {
    username: string;
    password: string;
    email: string
}

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface UserStatus {
    status: string;
    editing: string;
}
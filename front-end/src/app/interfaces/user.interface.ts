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
    username: string | null;
    email: string | null;
    password: string;
}

export interface UserStatus {
    status: string;
    editing: string;
}
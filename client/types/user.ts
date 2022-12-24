export interface User {
    id: string;
    email: string;
    username: string;
}

export interface CurrentUserResult {
    currentUser: User | null | undefined;
}

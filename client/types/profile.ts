export interface Profile {
    username: string;
    userId: string;
    bio?: string | undefined;
    fullName?: string | undefined;
    avatarUrl?: string | undefined;
    friends: Profile[];
    friendRequests: Profile[];
}

export interface Post {
    id: string;
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
    likes: string[];
    numberOfComments: number;
}

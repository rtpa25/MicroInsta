import { Comment } from './comment';

export interface Post {
    id: string;
    imageUrl: string;
    caption?: string | undefined;
    userId: string;
    username: string;
    likes: string[];
    numberOfComments: number;
    createdAt: string;
}

export interface DetailedPostType {
    post: Post;
    commentsAssociatedWithPost: Comment[];
}

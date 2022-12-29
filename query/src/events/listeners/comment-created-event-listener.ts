import { CommentCreatedEvent, Listener, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Comment } from '../../model/comment';
import { Post } from '../../model/post';

export class CommentCreatedEventListener extends Listener<CommentCreatedEvent> {
    readonly subject = Subjects.CommentCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: CommentCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { content, id, postId, userId, username } = data;

        const comment = Comment.build({
            content,
            id,
            postId,
            userId,
            username,
        });

        await comment.save();

        const commentedPost = await Post.findById(postId);

        if (!commentedPost) {
            throw new Error('Post not found');
        }

        commentedPost.set({
            numberOfComments: commentedPost.numberOfComments + 1,
        });

        await commentedPost.save();

        msg.ack();
    }
}

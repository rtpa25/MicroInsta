import { CommentDeletedEvent, Listener, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Comment } from '../../model/comment';
import { Post } from '../../model/post';

export class CommentDeletedEventListener extends Listener<CommentDeletedEvent> {
    readonly subject = Subjects.CommentDeleted;
    queueGroupName = queueGroupName;
    async onMessage(
        data: CommentDeletedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id } = data;

        const comment = await Comment.findByIdAndDelete(id);

        const post = await Post.findById(comment!.postId);

        if (!post) {
            throw new Error('Post not found');
        }

        post.set({
            numberOfComments: post.numberOfComments - 1,
        });

        await post.save();

        msg.ack();
    }
}

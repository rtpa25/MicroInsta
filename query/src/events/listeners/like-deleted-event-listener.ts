import { LikeDeletedEvent, Listener, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Like } from '../../model/like';
import { Post } from '../../model/post';

export class LikeDeletedEventListener extends Listener<LikeDeletedEvent> {
    readonly subject = Subjects.LikeDeleted;
    queueGroupName = queueGroupName;
    async onMessage(
        data: LikeDeletedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id } = data;

        const like = await Like.findByIdAndDelete(id);

        const post = await Post.findById(like!.postId);

        if (!post) {
            throw new Error('Post not found');
        }

        post.set({
            likes: post.likes.filter((userId) => userId !== like!.userId),
        });

        await post.save();

        msg.ack();
    }
}

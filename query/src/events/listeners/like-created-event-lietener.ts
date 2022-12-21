import { LikeCreatedEvent, Listener, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Like } from '../../model/like';
import { Post } from '../../model/post';

export class LikeCreatedEventListener extends Listener<LikeCreatedEvent> {
    readonly subject = Subjects.LikeCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: LikeCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, postId, userId } = data;

        const like = Like.build({
            id,
            postId,
            userId,
        });
        await like.save();

        const likedPost = await Post.findById(postId);

        if (!likedPost) {
            throw new Error('Post not found');
        }

        likedPost.likes.push(like.userId);

        await likedPost.save();

        msg.ack();
    }
}

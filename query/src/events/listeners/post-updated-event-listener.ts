import { Listener, PostUpdatedEvent, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../model/post';

export class PostUpdatedEventListener extends Listener<PostUpdatedEvent> {
    readonly subject = Subjects.PostUpdated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: PostUpdatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { caption, id, version } = data;

        const post = await Post.findOne({
            _id: id,
            version: version - 1,
        });

        if (!post) {
            throw new Error('Post not found');
        }

        post.set({ caption });

        await post.save();

        msg.ack();
    }
}

import { Listener, PostCreatedEvent, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../model/post';

export class PostCreatedEventListener extends Listener<PostCreatedEvent> {
    readonly subject = Subjects.PostCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: PostCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id, imageUrl, userId, username, caption } = data;

        const post = Post.build({
            id,
            imageUrl,
            userId,
            username,
            caption,
            likes: [],
            numberOfComments: 0,
        });

        await post.save();

        msg.ack();
    }
}

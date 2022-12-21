import { Listener, PostDeletedEvent, Subjects } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { Post } from '../../model/post';
import { queueGroupName } from './queue-group-name';
import { Comment } from '../../model/comment';
import { Like } from '../../model/like';

export class PostDeleteDEventListener extends Listener<PostDeletedEvent> {
    readonly subject = Subjects.PostDeleted;
    queueGroupName = queueGroupName;
    async onMessage(
        data: PostDeletedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id } = data;

        await Post.findByIdAndDelete(id);

        await Comment.deleteMany({ postId: id });

        await Like.deleteMany({ postId: id });

        msg.ack();
    }
}

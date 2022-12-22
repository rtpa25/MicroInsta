import { CommentDeletedEvent } from '@micro_insta/common';
import { natsWrapper } from '../../../nats-wrapper';
import { CommentDeletedEventListener } from '../comment-deleted-event-publisher';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../model/post';
import { Comment } from '../../../model/comment';

const setup = async () => {
    const listener = new CommentDeletedEventListener(natsWrapper.client);

    const data: CommentDeletedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('deletes the comment and updates the post entity when receives comment deleted event', async () => {
    const { data, listener, msg } = await setup();

    const postId = new mongoose.Types.ObjectId().toHexString();

    await Post.build({
        id: postId,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [],
        numberOfComments: 1,
        caption: 'test',
    }).save();

    await Comment.build({
        id: data.id,
        postId: postId,
        userId: new mongoose.Types.ObjectId().toHexString(),
        content: 'test comment',
    }).save();

    await listener.onMessage(data, msg);

    const comment = await Comment.findById(data.id);
    expect(comment).toBeNull();

    const post = await Post.findById(postId);
    expect(post!.numberOfComments).toEqual(0);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

import { natsWrapper } from '../../../nats-wrapper';
import { CommentCreatedEventListener } from '../comment-created-event-listener';
import { CommentCreatedEvent } from '@micro_insta/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../model/post';
import { Comment } from '../../../model/comment';

const setup = async () => {
    const listener = new CommentCreatedEventListener(natsWrapper.client);

    const data: CommentCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        content: 'test comment',
        username: 'test',
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('creates and stores a comment when receives the comment created event', async () => {
    const { listener, data, msg } = await setup();

    await Post.build({
        id: data.postId,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await listener.onMessage(data, msg);

    const post = await Post.findById(data.postId);

    expect(post!.numberOfComments).toEqual(1);

    const comment = await Comment.findById(data.id);

    expect(comment).toBeDefined();
});

it('acks the message eventually', async () => {
    const { listener, data, msg } = await setup();

    await Post.build({
        id: data.postId,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

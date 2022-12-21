import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { PostDeleteDEventListener } from '../post-deleted-event-listener';
import { PostDeletedEvent } from '@micro_insta/common';
import mongoose from 'mongoose';
import { Post } from '../../../model/post';

const setup = async () => {
    const listener = new PostDeleteDEventListener(natsWrapper.client);

    const postId = new mongoose.Types.ObjectId().toHexString();

    const data: PostDeletedEvent['data'] = {
        id: postId,
        version: 0,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('deletes the post when receives this event', async () => {
    const { data, listener, msg } = await setup();

    await Post.build({
        id: data.id,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await listener.onMessage(data, msg);

    await expect(Post.findById(data.id)).resolves.toBe(null);
});

it('acks the message received from the nats streaming server', async () => {
    const { data, listener, msg } = await setup();

    await Post.build({
        id: data.id,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

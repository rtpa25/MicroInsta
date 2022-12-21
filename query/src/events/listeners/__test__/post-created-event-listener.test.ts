import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { PostCreatedEventListener } from '../post-created-event-listener';
import { PostCreatedEvent } from '@micro_insta/common';
import mongoose from 'mongoose';
import { Post } from '../../../model/post';

const setup = async () => {
    const listener = new PostCreatedEventListener(natsWrapper.client);

    const data: PostCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        version: 0,
        createdAt: '',
        updatedAt: '',
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

it('creates and saves a post', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const post = await Post.findById(data.id);

    expect(post).toBeDefined();
    expect(post!.id).toEqual(data.id);
    expect(post!.imageUrl).toEqual(data.imageUrl);
    expect(post!.userId).toEqual(data.userId);
    expect(post!.username).toEqual(data.username);
});

it('acks the message received from the nats streaming server', async () => {
    const { data, listener, msg } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // Write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalledTimes(1);
});

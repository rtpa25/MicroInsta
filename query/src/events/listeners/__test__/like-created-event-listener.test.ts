import { natsWrapper } from '../../../nats-wrapper';
import { LikeCreatedEventListener } from '../like-created-event-lietener';
import { LikeCreatedEvent } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Like } from '../../../model/like';
import { Post } from '../../../model/post';

const setup = async () => {
    const listener = new LikeCreatedEventListener(natsWrapper.client);

    const data: LikeCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('creates and saves a like once received the like created event', async () => {
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

    const like = await Like.findById(data.id);

    expect(like).toBeDefined();
    expect(like!.id).toEqual(data.id);
    expect(like!.userId).toEqual(data.userId);
    expect(like!.postId).toEqual(data.postId);
});

it('acks the message received from the nats streaming server', async () => {
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

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

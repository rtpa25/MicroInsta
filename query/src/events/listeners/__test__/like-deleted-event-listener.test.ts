import { natsWrapper } from '../../../nats-wrapper';
import { LikeDeletedEventListener } from '../like-deleted-event-listener';
import { LikeDeletedEvent } from '@micro_insta/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../model/post';
import { Like } from '../../../model/like';

const setup = async () => {
    const listener = new LikeDeletedEventListener(natsWrapper.client);

    const data: LikeDeletedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };
    // Return all of this stuff
    return { listener, data, msg };
};

it('deletes a like when receives the like deleted event ', async () => {
    const { data, listener, msg } = await setup();

    const postId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    await Post.build({
        id: postId,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [userId],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await Like.build({
        id: data.id,
        postId,
        userId,
    }).save();

    await listener.onMessage(data, msg);

    const like = await Like.findById(data.id);
    expect(like).toBe(null);

    const post = await Post.findById(postId);
    expect(post!.likes).not.toContain(userId);
});

it('acks the message eventually', async () => {
    const { data, listener, msg } = await setup();

    const postId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();

    await Post.build({
        id: postId,
        imageUrl: 'https://www.google.com',
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        likes: [userId],
        numberOfComments: 0,
        caption: 'test',
    }).save();

    await Like.build({
        id: data.id,
        postId,
        userId,
    }).save();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalledTimes(1);
});

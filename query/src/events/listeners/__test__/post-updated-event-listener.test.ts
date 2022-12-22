import { PostUpdatedEvent } from '@micro_insta/common';
import { natsWrapper } from '../../../nats-wrapper';
import { PostUpdatedEventListener } from '../post-updated-event-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Post } from '../../../model/post';

const setup = async () => {
    const listener = new PostUpdatedEventListener(natsWrapper.client);

    const data: PostUpdatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        caption: 'new caption',
        version: 1,
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('updates the right post when received a post updated event', async () => {
    const { listener, data, msg } = await setup();

    await Post.build({
        id: data.id,
        caption: 'old caption',
        imageUrl: 'https://www.google.com',
        likes: [],
        numberOfComments: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
    }).save();

    await listener.onMessage(data, msg);

    const post = await Post.findById(data.id);

    expect(post?.caption).toEqual(data.caption);
    expect(post?.version).toEqual(data.version);
    expect(msg.ack).toHaveBeenCalled();
});

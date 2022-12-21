import { natsWrapper } from 'src/nats-wrapper';
import { LikeDeletedEventListener } from '../like-deleted-event-listener';
import { LikeDeletedEvent } from '@micro_insta/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

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

it.todo('deletes a like when receives the like deleted event ', async () => {
    const { data, listener, msg } = await setup();

    await listener.onMessage(data, msg);
});

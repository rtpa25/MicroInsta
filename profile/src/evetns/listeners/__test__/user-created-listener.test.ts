import { UserCreatedEvent } from '@micro_insta/common';
import { natsWrapper } from '../../../nats-wrapper';
import { UserCreatedListener } from '../user-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Profile } from '../../../model/profile';

const setup = () => {
    const listener = new UserCreatedListener(natsWrapper.client);

    const data: UserCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn().mockImplementation(() => {}),
    };

    return { listener, data, msg };
};

it('creates and saves a profile on receiving the profile:created event', async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    const profile = await Profile.findOne({ userId: data.id });

    expect(profile).toBeDefined();
    expect(profile!.username).toEqual(data.username);
    expect(profile!.friends).toEqual([]);
    expect(profile!.friendRequests).toEqual([]);
    expect(profile!.userId).toEqual(data.id);
});

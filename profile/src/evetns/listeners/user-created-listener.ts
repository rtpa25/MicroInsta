import { Listener, Subjects, UserCreatedEvent } from '@micro_insta/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Profile } from '../../model/profile';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    readonly subject = Subjects.UserCreated;
    queueGroupName = queueGroupName;
    async onMessage(
        data: UserCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        const { id: userId, username } = data;

        await Profile.build({
            userId,
            username,
            friends: [],
            friendRequests: [],
        }).save();

        msg.ack();
    }
}

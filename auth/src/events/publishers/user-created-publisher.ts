import { Publisher, Subjects, UserCreatedEvent } from '@micro_insta/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    readonly subject = Subjects.UserCreated;
}

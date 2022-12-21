import { Publisher, PostCreatedEvent, Subjects } from '@micro_insta/common';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
    readonly subject = Subjects.PostCreated;
}

import { PostUpdatedEvent, Publisher, Subjects } from '@micro_insta/common';

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
    readonly subject = Subjects.PostUpdated;
}

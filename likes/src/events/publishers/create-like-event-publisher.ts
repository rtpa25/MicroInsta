import { LikeCreatedEvent, Publisher, Subjects } from '@micro_insta/common';

export class LikeCreatedEventPublisher extends Publisher<LikeCreatedEvent> {
    readonly subject = Subjects.LikeCreated;
}

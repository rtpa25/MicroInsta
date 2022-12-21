import { LikeDeletedEvent, Publisher, Subjects } from '@micro_insta/common';

export class LikeDeletedEventPublisher extends Publisher<LikeDeletedEvent> {
    readonly subject = Subjects.LikeDeleted;
}

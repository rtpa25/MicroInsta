import { Publisher, PostDeletedEvent, Subjects } from '@micro_insta/common';

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
    readonly subject = Subjects.PostDeleted;
}

import { Publisher, CommentDeletedEvent, Subjects } from '@micro_insta/common';

export class CommentDeletedPublisher extends Publisher<CommentDeletedEvent> {
    subject: Subjects.CommentDeleted = Subjects.CommentDeleted;
}

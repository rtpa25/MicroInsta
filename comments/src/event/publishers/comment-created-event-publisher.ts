import { Publisher, CommentCreatedEvent, Subjects } from '@micro_insta/common';

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent> {
    subject: Subjects.CommentCreated = Subjects.CommentCreated;
}
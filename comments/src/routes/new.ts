import { requireAuth, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Comment } from '../model/comment';
import { CommentCreatedPublisher } from '../event/publishers/comment-created-event-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface CreateCommentRequestBody {
    content: string;
    postId: string;
}

router.post(
    '/api/comments',
    requireAuth,
    [
        body('content').not().isEmpty().withMessage('Content is required'),
        body('postId').isMongoId().withMessage('PostId must be provided'),
    ],
    validateRequest,
    async (req: Request<{}, {}, CreateCommentRequestBody>, res: Response) => {
        const { content, postId } = req.body;
        const currentUserId = req.currentUser!.id;

        const comment = Comment.build({
            content,
            postId,
            userId: currentUserId,
        });

        await comment.save();

        await new CommentCreatedPublisher(natsWrapper.client).publish({
            id: comment.id,
            content: comment.content,
            postId: comment.postId,
            userId: comment.userId,
        });

        res.status(201).send(comment);
    }
);

export { router as createCommentRouter };

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
    username: string;
}

router.post(
    '/api/comments',
    requireAuth,
    [
        body('content').not().isEmpty().withMessage('Content is required'),
        body('postId').isMongoId().withMessage('PostId must be provided'),
        body('username')
            .not()
            .isEmpty()
            .withMessage('Username is required')
            .isString()
            .withMessage('Username must be a string')
            .isLength({ min: 2, max: 20 })
            .withMessage('Username must be between 2 and 20 characters'),
    ],
    validateRequest,
    async (req: Request<{}, {}, CreateCommentRequestBody>, res: Response) => {
        const { content, postId, username } = req.body;
        const currentUserId = req.currentUser!.id;

        const comment = Comment.build({
            content,
            postId,
            userId: currentUserId,
            username,
        });

        await comment.save();

        await new CommentCreatedPublisher(natsWrapper.client).publish({
            id: comment.id,
            content: comment.content,
            postId: comment.postId,
            userId: comment.userId,
            username: comment.username,
        });

        res.status(201).send(comment);
    }
);

export { router as createCommentRouter };

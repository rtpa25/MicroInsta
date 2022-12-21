import {
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { CommentDeletedPublisher } from '../event/publishers/comment-deleted-event-publisher';
import { Comment } from '../model/comment';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface DeleteCommentRequestBody {
    postId: string;
}

router.delete(
    '/api/comments',
    requireAuth,
    [body('postId').isMongoId().withMessage('PostId must be provided')],
    validateRequest,
    async (req: Request<{}, {}, DeleteCommentRequestBody>, res: Response) => {
        const { postId } = req.body;
        const currentUserId = req.currentUser!.id;

        const comment = await Comment.findOne({ postId, currentUserId });

        if (!comment) {
            throw new NotFoundError();
        }

        await comment.remove();

        await new CommentDeletedPublisher(natsWrapper.client).publish({
            id: comment.id,
        });

        res.status(200).send(comment);
    }
);

export { router as deleteCommentRouter };

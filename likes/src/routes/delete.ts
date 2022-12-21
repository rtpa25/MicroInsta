import {
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { LikeDeletedEventPublisher } from '../events/publishers/remove-like-event-publisher';
import { Like } from '../model/like';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface DeleteLikeRequestBody {
    postId: string;
}

router.delete(
    '/api/likes',
    requireAuth,
    [body('postId').isMongoId().withMessage('PostId must be provided')],
    validateRequest,
    async (req: Request<{}, {}, DeleteLikeRequestBody>, res: Response) => {
        const { postId } = req.body;
        const currentUserId = req.currentUser!.id;

        const like = await Like.findOne({ postId, currentUserId });

        if (!like) {
            throw new NotFoundError();
        }

        await like.remove();

        await new LikeDeletedEventPublisher(natsWrapper.client).publish({
            id: like.id,
        });

        res.status(200).send(like);
    }
);

export { router as deleteLikeRouter };

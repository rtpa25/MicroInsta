import { requireAuth, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Like } from '../model/like';
import { LikeCreatedEventPublisher } from '../events/publishers/create-like-event-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface NewLikeRequestPostBody {
    postId: string;
}

router.post(
    '/api/likes',
    requireAuth,
    [body('postId').isMongoId().withMessage('PostId must be provided')],
    validateRequest,
    async (req: Request<{}, {}, NewLikeRequestPostBody>, res: Response) => {
        const { postId } = req.body;
        const userId = req.currentUser!.id;

        const like = Like.build({ postId, userId });

        await like.save();

        await new LikeCreatedEventPublisher(natsWrapper.client).publish({
            id: like.id,
            postId: like.postId,
            userId: like.userId,
        });

        res.status(201).send(like);
    }
);

export { router as newLikeRouter };

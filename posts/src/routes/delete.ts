import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Post } from '../model/post';
import { PostDeletedPublisher } from '../events/publisher/post-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
    '/api/posts/:postId',
    requireAuth,
    [param('postId').isMongoId().withMessage('postId must be a valid MongoId')],
    validateRequest,
    async (req: Request<{ postId: string }>, res: Response) => {
        const { postId } = req.params;
        const { id } = req.currentUser!;

        const post = await Post.findById(postId);

        if (!post) {
            throw new NotFoundError();
        }

        if (post.userId !== id) {
            throw new NotAuthorizedError();
        }

        await post.remove();

        await new PostDeletedPublisher(natsWrapper.client).publish({
            id: post.id,
            version: post.version,
        });

        res.status(204).send(post);
    }
);

export { router as deletePostRouter };

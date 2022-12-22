import {
    NotAuthorizedError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Post } from '../model/post';
import { PostUpdatedPublisher } from '../events/publisher/post-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface UpdatePostRequestBody {
    caption: string;
}

router.put(
    '/api/posts/:id',
    requireAuth,
    [body('caption').not().isEmpty().withMessage('Caption is required')],
    validateRequest,
    async (
        req: Request<{ id: string }, {}, UpdatePostRequestBody>,
        res: Response
    ) => {
        const { caption } = req.body;
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        post.set({
            caption,
        });

        await post.save();

        await new PostUpdatedPublisher(natsWrapper.client).publish({
            caption: post.caption!,
            id: post.id,
            version: post.version,
        });

        res.status(200).send(post);
    }
);

export { router as updatePostRouter };

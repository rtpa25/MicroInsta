import { requireAuth, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Post } from '../model/post';
import { PostCreatedPublisher } from '../events/publisher/post-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

interface NewPostRouterRequestBody {
    imageUrl: string;
    caption?: string | undefined;
}

router.post(
    '/api/posts',
    requireAuth,
    [
        body('imageUrl').isURL().withMessage('imageUrl must be a valid URL'),
        body('caption').isString().optional(),
    ],
    validateRequest,
    async (req: Request<{}, {}, NewPostRouterRequestBody>, res: Response) => {
        const { imageUrl, caption } = req.body;
        const { id, username } = req.currentUser!;

        const post = Post.build({
            imageUrl,
            caption,
            userId: id,
            username,
        });
        await post.save();

        await new PostCreatedPublisher(natsWrapper.client).publish({
            id: post.id,
            imageUrl: post.imageUrl,
            caption: post.caption,
            userId: post.userId,
            username: post.username,
            version: post.version,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        });

        res.status(201).send(post);
    }
);

export { router as newPostRouter };

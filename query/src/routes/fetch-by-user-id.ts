import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Post } from '../model/post';

const router = Router();

router.get(
    '/api/query/:userId',
    requireAuth,
    [param('userId').isMongoId().withMessage('userId must be valid')],
    validateRequest,
    async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;

        if (!userId) {
            throw new BadRequestError('Invalid request');
        }

        const posts = await Post.find({ userId });

        res.send(posts);
    }
);

export { router as fetchPostsByUserIdRouter };

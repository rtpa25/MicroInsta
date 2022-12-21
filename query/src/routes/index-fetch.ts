import { requireAuth, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';
import { Post } from '../model/post';

const router = Router();

router.get(
    '/api/query',
    requireAuth,
    [
        query('limit').isNumeric().withMessage('Limit must be a number'),
        query('offset').isNumeric().withMessage('Offset must be a number'),
    ],
    validateRequest,
    async (
        req: Request<{}, {}, {}, { limit: string; offset: string }>,
        res: Response
    ) => {
        const { limit, offset } = req.query;

        const posts = await Post.find({})
            .sort({ createdAt: 'descending' })
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        res.send(posts);
    }
);

export { router as indexQueryRouter };

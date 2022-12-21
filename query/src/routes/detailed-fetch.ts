import { requireAuth, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Post } from '../model/post';
import { Comment } from '../model/comment';

const router = Router();

router.get(
    '/api/query/:postId',
    requireAuth,
    [param('postId').isMongoId().withMessage('PostId must be a valid MongoId')],
    validateRequest,
    async (req: Request<{ postId: string }>, res: Response) => {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        const commentsAssociatedWithPost = await Comment.find({
            postId: post.id,
        });

        res.send({
            post,
            commentsAssociatedWithPost,
        });
    }
);

export { router as detailedQueryRouter };

import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

router.get(
    '/api/profile/:userId',
    requireAuth,
    [param('userId').isMongoId().withMessage('userId must be valid')],
    validateRequest,
    async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;

        if (!userId) {
            throw new BadRequestError('Invalid request');
        }

        const profile = await Profile.findOne({ userId })
            .populate('friends')
            .populate('friendRequests');

        if (!profile) {
            throw new BadRequestError('Profile not found');
        }
        return res.status(200).send(profile);
    }
);

export { router as findProfileByUserIdRouter };

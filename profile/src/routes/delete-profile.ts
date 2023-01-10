import {
    BadRequestError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

router.delete(
    '/api/profile/:userId',
    requireAuth,
    [param('userId').isMongoId().withMessage('userId must be valid')],
    validateRequest,
    async (req: Request<{ userId: string }>, res: Response) => {
        const { userId } = req.params;

        if (!userId) {
            throw new BadRequestError('Invalid request');
        }

        const currentUserId = req.currentUser!.id;

        const profile = await Profile.findOne({ userId });

        if (!profile) {
            throw new BadRequestError('Profile not found');
        }

        if (currentUserId !== profile.userId) {
            throw new NotAuthorizedError();
        }

        await profile.remove();

        res.status(200).send(profile);
    }
);

export { router as deleteProfileRouter };

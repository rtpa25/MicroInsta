import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

interface UpdateProfileRequestBody {
    fullName: string;
    bio: string;
    avatarUrl: string;
}

router.put(
    '/api/profile/:userId',
    requireAuth,
    [
        param('userId')
            .notEmpty()
            .withMessage('userId must be supplied')
            .isMongoId()
            .withMessage('userId must be valid'),
        body('fullName')
            .notEmpty()
            .withMessage('fullName must be supplied')
            .isString()
            .withMessage('fullName must be a string')
            .isLength({ min: 4, max: 50 })
            .withMessage('fullName must be between 4 and 50 characters'),
        body('bio')
            .notEmpty()
            .withMessage('bio must be supplied')
            .isString()
            .withMessage('bio must be a string')
            .isLength({ min: 5, max: 200 })
            .withMessage('bio must be between 5 and 200 characters'),
        body('avatarUrl')
            .notEmpty()
            .withMessage('avatarUrl must be supplied')
            .isURL()
            .withMessage('avatarUrl must be a valid URL'),
    ],
    validateRequest,
    async (
        req: Request<{ userId: string }, {}, UpdateProfileRequestBody>,
        res: Response
    ) => {
        const { userId } = req.params;
        const { fullName, bio, avatarUrl } = req.body;

        const existingProfile = await Profile.findOne({ userId });

        if (!existingProfile) {
            throw new BadRequestError('Profile not found');
        }

        const { id: currentUserId } = req.currentUser!;

        if (currentUserId !== userId) {
            throw new BadRequestError(
                'You are not authorized to update this profile'
            );
        }

        existingProfile.set({ fullName, bio, avatarUrl });

        await existingProfile.save();

        res.status(200).send(existingProfile);
    }
);

export { router as updateProfileRouter };

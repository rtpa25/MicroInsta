import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

interface AddFriendRequestBody {
    friendId: string;
}

router.put(
    '/api/profile/add-friend/:userId',
    requireAuth,
    [body('friendId').isMongoId().withMessage('friendId must be valid')],
    validateRequest,
    async (
        req: Request<{ userId: string }, {}, AddFriendRequestBody>,
        res: Response
    ) => {
        console.log('add-friend.ts');

        const { userId } = req.params;
        const { friendId } = req.body;

        const existingProfile = await Profile.findOne({ userId });

        if (!existingProfile) {
            throw new BadRequestError('Profile not found');
        }

        const toBeFriendProfile = await Profile.findOne({ userId: friendId });

        if (!toBeFriendProfile) {
            throw new BadRequestError('Profile not found');
        }

        if (existingProfile.friends.includes(toBeFriendProfile)) {
            throw new BadRequestError('Already friends');
        }

        if (toBeFriendProfile.friendRequests.includes(existingProfile)) {
            throw new BadRequestError('Already requested');
        }

        toBeFriendProfile.friendRequests.push(existingProfile);

        await toBeFriendProfile.save();

        res.status(200).send(toBeFriendProfile);
    }
);

export { router as addFriendRouter };

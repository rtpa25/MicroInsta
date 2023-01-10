import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

interface AddFriendRequestBody {
    receiverId: string;
}

router.put(
    '/api/profile/add-friend/:senderId',
    requireAuth,
    [
        body('receiverId').isMongoId().withMessage('receiverId must be valid'),
        param('senderId').isMongoId().withMessage('senderId must be valid'),
    ],
    validateRequest,
    async (
        req: Request<{ senderId: string }, {}, AddFriendRequestBody>,
        res: Response
    ) => {
        const { senderId } = req.params;
        const { receiverId } = req.body;

        if (!senderId || !receiverId) {
            throw new BadRequestError('Invalid request');
        }

        const senderProfile = await Profile.findOne({ userId: senderId });

        if (!senderProfile) {
            throw new BadRequestError('Profile not found');
        }

        const receiverProfile = await Profile.findOne({ userId: receiverId });

        if (!receiverProfile) {
            throw new BadRequestError('Profile not found');
        }

        if (senderProfile.friends.includes(receiverProfile)) {
            throw new BadRequestError('Already friends');
        }

        if (receiverProfile.friendRequests.includes(senderProfile)) {
            throw new BadRequestError('Already requested');
        }

        receiverProfile.set({
            friendRequests: [...receiverProfile.friendRequests, senderProfile],
        });

        await receiverProfile.save();

        res.status(200).send(receiverProfile);
    }
);

export { router as addFriendRouter };

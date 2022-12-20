import {
    BadRequestError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

interface AcceptFriendRequestRouterBody {
    receiverId: string;
}

router.put(
    '/api/profile/accept-friend-request/:senderId',
    requireAuth,
    [
        param('senderId').isMongoId().withMessage('senderId must be valid'),
        body('receiverId').isMongoId().withMessage('receiverId must be valid'),
    ],
    validateRequest,
    async (
        req: Request<{ senderId: string }, {}, AcceptFriendRequestRouterBody>,
        res: Response
    ) => {
        const { senderId } = req.params;
        const { receiverId } = req.body;

        const currentUser = req.currentUser!;

        const senderProfile = await Profile.findOne({ userId: senderId });

        if (!senderProfile) {
            throw new BadRequestError('Profile not found');
        }

        const receiverProfile = await Profile.findOne({ userId: receiverId });

        if (!receiverProfile) {
            throw new BadRequestError('Profile not found');
        }

        if (currentUser.id !== receiverProfile.userId) {
            throw new NotAuthorizedError();
        }

        if (senderProfile.friends.includes(receiverProfile._id)) {
            throw new BadRequestError('Already friends');
        }

        if (!receiverProfile.friendRequests.includes(senderProfile._id)) {
            throw new BadRequestError('Not requested');
        }

        senderProfile.set({
            friends: [...senderProfile.friends, receiverProfile._id],
        });

        receiverProfile.set({
            friends: [...receiverProfile.friends, senderProfile._id],
        });

        await senderProfile.save();
        await receiverProfile.save();

        res.status(200).send(senderProfile);
    }
);

export { router as acceptFriendRequestRouter };

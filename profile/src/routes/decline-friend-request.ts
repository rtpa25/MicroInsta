import {
    BadRequestError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

interface DeclineFriendRequestRouterBody {
    receiverId: string;
}

router.put(
    '/api/profile/decline-friend-request/:senderId',
    requireAuth,
    [
        param('senderId').isMongoId().withMessage('senderId must be valid'),
        body('receiverId').isMongoId().withMessage('receiverId must be valid'),
    ],
    validateRequest,
    async (
        req: Request<{ senderId: string }, {}, DeclineFriendRequestRouterBody>,
        res: Response
    ) => {
        const { senderId } = req.params;
        const { receiverId } = req.body;

        if (!senderId || !receiverId) {
            throw new BadRequestError('Invalid request');
        }

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

        receiverProfile.set({
            friendRequests: receiverProfile.friendRequests.filter(
                (id) => !id.equals(senderProfile._id)
            ),
        });

        await receiverProfile.save();

        res.send(receiverProfile).status(200);
    }
);

export { router as declineFriendRequestRouter };

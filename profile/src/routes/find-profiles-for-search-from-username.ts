import {
    BadRequestError,
    requireAuth,
    validateRequest,
} from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { query } from 'express-validator';
import { Profile } from '../model/profile';

const router = Router();

router.get(
    '/api/profile',
    requireAuth,
    [query('username').isString().withMessage('username must be a string')],
    validateRequest,
    async (req: Request<{}, {}, {}, { username: string }>, res: Response) => {
        const { username } = req.query;

        if (!username) {
            throw new BadRequestError('Invalid request');
        }

        const profiles = await Profile.find({
            username: { $regex: username, $options: 'i' },
        });
        return res.status(200).send(profiles);
    }
);

export { router as findProfilesForSearchFromUsernameRouter };

import { BadRequestError, validateRequest } from '@micro_insta/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = Router();

interface SigninRequestBody {
    email: string;
    password: string;
}

router.post(
    '/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],
    validateRequest,
    async (req: Request<{}, {}, SigninRequestBody>, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJWT = User.createJWT(existingUser);

        req.session = {
            jwt: userJWT,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };

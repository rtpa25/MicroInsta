import 'express-async-errors';

import { NotFoundError, currentUser, errorHandler } from '@micro_insta/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { updateProfileRouter } from './routes/update-profile';
import { addFriendRouter } from './routes/add-friend';
import { acceptFriendRequestRouter } from './routes/accept-friend-request';
import { declineFriendRequestRouter } from './routes/decline-friend-request';

const app = express();

app.set('trust proxy', true); //traffic is being proxied to our app through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUser);

app.use(updateProfileRouter);
app.use(addFriendRouter);
app.use(acceptFriendRequestRouter);
app.use(declineFriendRequestRouter);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };

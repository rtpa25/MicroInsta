import 'express-async-errors';

import { NotFoundError, currentUser, errorHandler } from '@micro_insta/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { newPostRouter } from './routes/new';
import { deletePostRouter } from './routes/delete';
import { updatePostRouter } from './routes/update';

const app = express();

app.set('trust proxy', true); //traffic is being proxied to our app through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(currentUser);
app.use(newPostRouter);
app.use(deletePostRouter);
app.use(updatePostRouter);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };

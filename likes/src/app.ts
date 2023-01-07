import 'express-async-errors';

import { NotFoundError, currentUser, errorHandler } from '@micro_insta/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { newLikeRouter } from './routes/new';
import { deleteLikeRouter } from './routes/delete';

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
app.use(newLikeRouter);
app.use(deleteLikeRouter);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };

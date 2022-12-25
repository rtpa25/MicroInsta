import 'express-async-errors';

import { NotFoundError, currentUser, errorHandler } from '@micro_insta/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { indexQueryRouter } from './routes/index-fetch';
import { detailedQueryRouter } from './routes/detailed-fetch';
import { fetchPostsByUserIdRouter } from './routes/fetch-by-user-id';

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
app.use(indexQueryRouter);
app.use(detailedQueryRouter);
app.use(fetchPostsByUserIdRouter);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };

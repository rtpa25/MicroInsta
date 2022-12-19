import 'express-async-errors';

import express from 'express';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler } from '@micro_insta/common';

const app = express();

app.set('trust proxy', true); //traffic is being proxied to our app through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError()
}); //catch all route handler not defined above

app.use(errorHandler)

export { app };

import 'express-async-errors';

import { NotFoundError, errorHandler } from '@micro_insta/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true); //traffic is being proxied to our app through ingress-nginx

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

app.all('*', async (_req, _res, _next) => {
    throw new NotFoundError();
}); //catch all route handler not defined above

app.use(errorHandler);

export { app };

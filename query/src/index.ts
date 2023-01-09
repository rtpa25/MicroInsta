import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { PostCreatedEventListener } from './events/listeners/post-created-event-listener';
import { PostDeleteDEventListener } from './events/listeners/post-deleted-event-listener';
import { CommentCreatedEventListener } from './events/listeners/comment-created-event-listener';
import { CommentDeletedEventListener } from './events/listeners/comment-deleted-event-publisher';
import { LikeCreatedEventListener } from './events/listeners/like-created-event-lietener';
import { LikeDeletedEventListener } from './events/listeners/like-deleted-event-listener';
import { PostUpdatedEventListener } from './events/listeners/post-updated-event-listener';

const bootstrap = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_URI) {
        throw new Error('NATS_URI must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URI
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new PostCreatedEventListener(natsWrapper.client).listen();
        new PostDeleteDEventListener(natsWrapper.client).listen();
        new PostUpdatedEventListener(natsWrapper.client).listen();
        new LikeCreatedEventListener(natsWrapper.client).listen();
        new LikeDeletedEventListener(natsWrapper.client).listen();
        new CommentCreatedEventListener(natsWrapper.client).listen();
        new CommentDeletedEventListener(natsWrapper.client).listen();
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
};

bootstrap();

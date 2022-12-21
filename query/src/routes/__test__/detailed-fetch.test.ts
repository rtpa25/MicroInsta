import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Post } from '../../model/post';
import { Comment } from '../../model/comment';

it('returns a 200 on successful fetch', async () => {
    const postId = new mongoose.Types.ObjectId().toHexString();

    const post = Post.build({
        id: postId,
        userId: new mongoose.Types.ObjectId().toHexString(),
        username: 'test',
        caption: 'test caption',
        imageUrl: 'http://test.com',
        likes: [],
        numberOfComments: 0,
    });

    await post.save();

    await request(app)
        .get(`/api/query/${postId}`)
        .set(
            'Cookie',
            global.signin(new mongoose.Types.ObjectId().toHexString())
        )
        .expect(200);
});

it('returns the details of a post and comments associated to it', async () => {
    const postId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const username = 'test';
    const caption = 'test caption';
    const imageUrl = 'test image url';

    const post = Post.build({
        id: postId,
        userId,
        username,
        caption,
        imageUrl,
        likes: [],
        numberOfComments: 0,
    });

    await post.save();

    const comment = Comment.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        postId,
        userId,
        content: 'test comment',
    });

    await comment.save();

    const res = await request(app)
        .get(`/api/query/${postId}`)
        .set('Cookie', global.signin(userId))
        .expect(200);

    expect(res.body.post.id).toEqual(postId);
    expect(res.body.commentsAssociatedWithPost[0].content).toEqual(
        'test comment'
    );
});

import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Profile } from '../../model/profile';

it('finds a users profile when right username is given', async () => {
    const userId1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userId1);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userId1,
        username: 'test1',
    }).save();

    const userId2 = new mongoose.Types.ObjectId().toHexString();

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userId2,
        username: 'test2',
    }).save();

    const response = await request(app)
        .get(`/api/profile?username=test`)
        .set('Cookie', userCookie1)
        .expect(200);

    expect(response.body.length).toEqual(2);
});

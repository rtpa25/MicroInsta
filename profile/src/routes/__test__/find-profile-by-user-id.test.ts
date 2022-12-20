import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Profile } from '../../model/profile';

it('finds a users profile when right id is given', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID1,
        username: 'test1',
    }).save();

    const response = await request(app)
        .get(`/api/profile/${userID1}`)
        .set('Cookie', userCookie1)
        .expect(200);

    expect(response.body.userId).toEqual(userID1);
    expect(response.body.username).toEqual('test1');
    expect(response.body.friends).toEqual([]);
    expect(response.body.friendRequests).toEqual([]);
});

it('returns a 400 request when wrong user id is given and profile not found', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    const response = await request(app)
        .get(`/api/profile/${userID1}`)
        .set('Cookie', userCookie1)
        .expect(400);

    expect(response.body.errors[0].message).toEqual('Profile not found');
});

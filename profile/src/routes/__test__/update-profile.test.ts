import request from 'supertest';
import { app } from '../../app';
import { Profile } from '../../model/profile';
import mongoose from 'mongoose';

it('updates a user profile with valid inputs', async () => {
    const userID = new mongoose.Types.ObjectId().toHexString();
    const user = global.signin(userID);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID,
        username: 'test',
    }).save();

    const response = await request(app)
        .put(`/api/profile/${userID}`)
        .set('Cookie', user)
        .send({
            fullName: 'test name',
            bio: 'test bio',
            avatarUrl: 'https://test.com',
        })
        .expect(200);

    expect(response.body.fullName).toEqual('test name');
    expect(response.body.bio).toEqual('test bio');
    expect(response.body.avatarUrl).toEqual('https://test.com');
});

it('returns a 401 if the user is not authenticated', async () => {
    const userID = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/profile/${userID}`)
        .send({
            fullName: 'test name',
            bio: 'test bio',
            avatarUrl: 'https://test.com',
        })
        .expect(401);
});

it('returns a 400 if the user is not authorized to update the profile', async () => {
    const userID = new mongoose.Types.ObjectId().toHexString();
    const user = global.signin(userID);

    await request(app)
        .put(`/api/profile/${userID}`)
        .set('Cookie', user)
        .send({
            fullName: 'test name',
            bio: 'test bio',
            avatarUrl: 'https://test.com',
        })
        .expect(400);
});

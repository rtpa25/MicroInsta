import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Profile } from '../../model/profile';

it('deletes a users profile when right id is given', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID1,
        username: 'test1',
    }).save();

    const response = await request(app)
        .delete(`/api/profile/${userID1}`)
        .set('Cookie', userCookie1)
        .expect(200);

    expect(response.body.userId).toEqual(userID1);
    expect(response.body.username).toEqual('test1');
    expect(response.body.friends).toEqual([]);
    expect(response.body.friendRequests).toEqual([]);

    const profiles = await Profile.find({ userId: userID1 });

    expect(profiles.length).toEqual(0);
});

it('returns a 400 request when wrong user id is given and profile not found', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    const response = await request(app)
        .delete(`/api/profile/${userID1}`)
        .set('Cookie', userCookie1)
        .expect(400);

    expect(response.body.errors[0].message).toEqual('Profile not found');
});

it('returns a 401 response when unauthorized user tries to delete a profile', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID1,
        username: 'test1',
    }).save();

    const userID2 = new mongoose.Types.ObjectId().toHexString();
    const userCookie2 = global.signin(userID2);

    const response = await request(app)
        .delete(`/api/profile/${userID1}`)
        .set('Cookie', userCookie2)
        .expect(401);

    expect(response.body.errors[0].message).toEqual('Not authorized');
});

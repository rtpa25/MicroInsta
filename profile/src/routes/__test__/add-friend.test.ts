import { Profile } from '../../model/profile';
import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('adding friends work with valid inputs', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID1,
        username: 'test1',
    }).save();

    const userID2 = new mongoose.Types.ObjectId().toHexString();

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID2,
        username: 'test2',
    }).save();

    const response = await request(app)
        .put(`/api/profile/add-friend/${userID1}`)
        .set('Cookie', userCookie1)
        .send({
            receiverId: userID2,
        })
        .expect(200);

    //receiver profile
    const profile2 = await Profile.findOne({ userId: userID2 });
    //sender profile
    const profile1 = await Profile.findOne({ userId: userID1 });

    expect(profile2!.friendRequests[0].toJSON()).toEqual(profile1!.id);

    expect(response.body.friendRequests[0].userId).toEqual(userID1);
    expect(response.body.friends).toEqual([]);
});

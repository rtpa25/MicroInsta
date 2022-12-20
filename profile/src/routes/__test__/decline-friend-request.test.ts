import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Profile } from '../../model/profile';

it('accepts a friend request with valid inputs', async () => {
    const userID1 = new mongoose.Types.ObjectId().toHexString();
    const userCookie1 = global.signin(userID1);

    await Profile.build({
        friendRequests: [],
        friends: [],
        userId: userID1,
        username: 'test1',
    }).save();

    const userID2 = new mongoose.Types.ObjectId().toHexString();
    const userCookie2 = global.signin(userID2);

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

    const response2 = await request(app)
        .put(`/api/profile/decline-friend-request/${userID1}`)
        .set('Cookie', userCookie2)
        .send({
            receiverId: userID2,
        })
        .expect(200);

    const profile2Updated = await Profile.findOne({ userId: userID2 });
    const profile1Updated = await Profile.findOne({ userId: userID1 });

    expect(profile2Updated!.friends.length).toEqual(0);
    expect(profile1Updated!.friends.length).toEqual(0);
    expect(response2.body.friends.length).toEqual(0);
    expect(profile2Updated!.friendRequests.length).toEqual(0);
});

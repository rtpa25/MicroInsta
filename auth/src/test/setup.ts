import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;
jest.mock('../nats-wrapper');

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';
    const username = 'test';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
            username,
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
};

beforeAll(async () => {
    process.env.JWT_KEY = 'SECRET';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close(); // Close client's connections first
    await mongo.stop(); // Then stop the mongo server
});

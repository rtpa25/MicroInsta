import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
    var signin: (id: string) => string[];
    var createMongoId: () => string;
}

let mongo: MongoMemoryServer;
jest.mock('../nats-wrapper');

global.signin = (id: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id,
        email: 'ticketing@ticketing.com',
        username: 'test',
    };
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]; //array of strings for supertest
};

global.createMongoId = () => {
    return new mongoose.Types.ObjectId().toHexString();
};

beforeAll(async () => {
    process.env.JWT_KEY = 'SECRET';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close(); // Close client's connections first
    await mongo.stop(); // Then stop the mongo server
});

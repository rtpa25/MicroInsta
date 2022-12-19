import request from 'supertest';
import { app } from '../../app';

const SET_COOKIE_HEADER_MESSAGE =
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly';

it('clears the cookie after signing out', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@email.com',
            password: 'password',
            username: 'ronit',
        })
        .expect(201);
    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.get('Set-Cookie')[0]).toEqual(SET_COOKIE_HEADER_MESSAGE);
});

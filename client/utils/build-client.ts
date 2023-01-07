import axios, { AxiosInstance } from 'axios';
import { IncomingMessage } from 'node:http';

export const buildClient = (
    req?: IncomingMessage | undefined
): AxiosInstance => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL:
                'http://www.micro-insta.ronit.pro',
            headers: req!.headers,
        });
    } else {
        return axios.create({
            baseURL: '/',
        });
    }
};

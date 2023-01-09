import axios, { AxiosInstance } from 'axios';
import { IncomingMessage } from 'node:http';

export const buildClient = (
    req?: IncomingMessage | undefined
): AxiosInstance => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL:
                process.env.NODE_ENV === 'production'
                    ? 'http://www.insta.nyka.site/'
                    : 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req!.headers,
        });
    } else {
        return axios.create({
            baseURL: '/',
        });
    }
};

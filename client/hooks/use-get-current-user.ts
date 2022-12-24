import axios from 'axios';
import useSWR from 'swr';
import { CurrentUserResult } from '../types/user';

const fetchCurrentUserRequest = async (url: string) => {
    return axios.get<CurrentUserResult>(url);
};

export const useGetCurrentUser = () => {
    const { data, error, isLoading } = useSWR(
        '/api/users/currentuser',
        fetchCurrentUserRequest
    );
    const currentUser = data?.data?.currentUser;

    return { currentUser, isLoading, error };
};

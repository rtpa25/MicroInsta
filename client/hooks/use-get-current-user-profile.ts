import axios from 'axios';
import useSWR from 'swr';
import { Profile } from '../types/profile';
import { useGetCurrentUser } from './use-get-current-user';

const fetchCurrentUserProfileWithId = async (url: string) => {
    return axios.get<Profile>(url);
};

export const useGetCurrentUserProfile = () => {
    const { currentUser } = useGetCurrentUser();

    const { data, error, isLoading } = useSWR(
        `/api/profile/${currentUser?.id}`,
        fetchCurrentUserProfileWithId
    );

    return { data, error, isLoading, currentUser };
};

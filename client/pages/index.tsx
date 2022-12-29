import { Box, Spinner } from '@chakra-ui/react';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import InfiniteScroll from 'react-swr-infinite-scroll';
import useSWRInfinite from 'swr/infinite';

import AppBar from '../components/app-bar';
import { requireAuth } from '../components/hoc/require-auth';
import HomePagePost from '../components/home-page-post';
import { Post } from '../types/post';
import { useAppDispatch } from '../hooks/use-redux';
import { setSWR } from '../store/slices/index-paginated-swr-slice';
import { ACCENT_COLOR } from '../styles/consts';

const Home = () => {
    const [limit] = useState(10);

    const dispatch = useAppDispatch();

    const swr = useSWRInfinite(
        (index, prev) => `/api/query?limit=${limit}&offset=${index}`,
        {
            fetcher: async (key) => fetch(key).then((res) => res.json()),
        }
    );

    dispatch(setSWR(swr));

    const loadingState = (
        <Box color={ACCENT_COLOR} textAlign='center'>
            <Spinner size={'xl'} />
        </Box>
    );

    return (
        <Box h={'90vh'} mb={0}>
            <AppBar />
            <InfiniteScroll
                swr={swr}
                loadingIndicator={loadingState}
                isReachingEnd={(swr) => {
                    return (
                        swr.data?.[0]?.length === 0 ||
                        swr.data?.[swr.data?.length - 1]?.length < limit
                    );
                }}>
                {(response: any) =>
                    response?.map((post: Post) => (
                        <HomePagePost key={post.id} post={post} />
                    ))
                }
            </InfiniteScroll>
        </Box>
    );
};

export const getServerSideProps = requireAuth(
    async (context: GetServerSidePropsContext) => {
        return {
            props: {},
        };
    }
);

export default Home;

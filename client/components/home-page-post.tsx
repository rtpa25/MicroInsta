import {
    Avatar,
    Box,
    Button,
    Flex,
    IconButton,
    Image,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import {
    BsBookmarkCheck,
    BsChatRight,
    BsFillSuitHeartFill,
    BsSuitHeart,
} from 'react-icons/bs';
import { SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useGetCurrentUser } from '../hooks/use-get-current-user';
import { ACCENT_COLOR_LIGHT } from '../styles/consts';
import { Like } from '../types/like';
import { Post } from '../types/post';
import { convertTimeToHoursAgo } from '../utils/convert-time-to-hours-ago';
import FullImageDisplayModal from './full-post-display-modal';
import { useAppSelector } from '../hooks/use-redux';

interface HomePagePostProps {
    post: Post;
}

interface LikeRequestBody {
    arg: {
        postId: string;
    };
}

const createLikeRequest = async (url: string, { arg }: LikeRequestBody) => {
    return axios<Like>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const deleteLikeRequest = async (url: string, { arg }: LikeRequestBody) => {
    return axios<Like>({
        method: 'delete',
        url: url,
        data: arg,
    });
};

const HomePagePost: FC<HomePagePostProps> = ({ post }) => {
    const { onClose, onOpen, isOpen } = useDisclosure();

    const [isLiked, setIsLiked] = useState<boolean>(false);

    const { trigger: createLikeTrigger, isMutating: createLikeIsMutating } =
        useSWRMutation('/api/likes', createLikeRequest);

    const { trigger: deleteLikeTrigger, isMutating: deleteLikeIsMutating } =
        useSWRMutation('/api/likes', deleteLikeRequest);

    const { currentUser } = useGetCurrentUser();

    const swr = useAppSelector((state) => state.indexPaginatedSWR.swr);

    useEffect(() => {
        post.likes.map((uid: string) => {
            if (uid === currentUser?.id) {
                setIsLiked(true);
            }
        });
    }, [currentUser?.id, post.likes]);

    const likesHandler = async () => {
        try {
            if (isLiked) {
                await deleteLikeTrigger({ postId: post.id });
                setIsLiked(false);
            } else {
                await createLikeTrigger({ postId: post.id });
                setIsLiked(true);
            }
            swr?.mutate();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            maxW={['100%', '80%', '60%', '40%']}
            mx='auto'
            mt={10}
            pb={5}
            bgColor='black'
            rounded={'md'}
            pt={3}>
            <Stack h={'full'} justifyContent={'space-between'}>
                <Box w={'full'} h='full'>
                    <Flex alignItems={'center'} mb={2.5}>
                        <Avatar size={'sm'} mx={2.5} src={post.username} />
                        <Text
                            fontWeight={'hairline'}
                            color={ACCENT_COLOR_LIGHT}>
                            {post.username}
                        </Text>
                    </Flex>
                    <Box w='full' mr={5}>
                        <Image
                            w={'full'}
                            objectFit='cover'
                            src={post.imageUrl}
                            alt={post.username}
                        />
                    </Box>
                    <Flex justifyContent={'space-between'} mx='2.5' my={0}>
                        <Box>
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                color='red'
                                aria-label='like'
                                isLoading={
                                    createLikeIsMutating || deleteLikeIsMutating
                                }
                                onClick={likesHandler}
                                icon={
                                    isLiked ? (
                                        <BsFillSuitHeartFill />
                                    ) : (
                                        <BsSuitHeart />
                                    )
                                }
                            />
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                onClick={onOpen}
                                aria-label='comment'
                                icon={<BsChatRight />}
                            />
                        </Box>
                        <Box>
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                aria-label='comment'
                                icon={<BsBookmarkCheck />}
                            />
                        </Box>
                    </Flex>
                    <Box mx={2.5} mb={2.5}>
                        <Text letterSpacing={'wide'} fontWeight={'thin'}>
                            {post.likes.length}{' '}
                            {post.likes.length === 1 ? 'like' : 'likes'}
                        </Text>
                    </Box>
                    <Box mx={2.5}>
                        <Text letterSpacing={'wide'} fontWeight={'thin'}>
                            {post.caption}
                        </Text>
                        <Button
                            variant={'link'}
                            onClick={onOpen}
                            color={'gray.500'}
                            fontSize='sm'
                            mt={2.5}>
                            {post.numberOfComments === 1
                                ? 'view 1 comment'
                                : `view all ${post.numberOfComments} comments`}
                        </Button>
                        <Text color={'gray.500'} fontSize='xs' mt={2.5}>
                            {convertTimeToHoursAgo(post.createdAt)} hours ago
                        </Text>
                    </Box>
                </Box>
            </Stack>
            <FullImageDisplayModal
                onClose={onClose}
                isOpen={isOpen}
                postId={post.id}
                creatorName={post.username}
            />
        </Box>
    );
};

export default HomePagePost;

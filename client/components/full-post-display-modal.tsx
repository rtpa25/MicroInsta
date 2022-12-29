import {
    Avatar,
    Box,
    Divider,
    Flex,
    Image,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Text,
    UnorderedList,
} from '@chakra-ui/react';
import axios from 'axios';
import { FC, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useGetCurrentUserProfile } from '../hooks/use-get-current-user-profile';
import { useAppSelector } from '../hooks/use-redux';
import { ACCENT_COLOR } from '../styles/consts';
import { DetailedPostType } from '../types/post';
import CommentInputBar from './comment-input-bar';

interface FullImageDisplayModalProps {
    onClose: () => void;
    isOpen: boolean;
    postId: string;
    creatorName: string;
}

const fetchPostDetails = async (url: string) => {
    return axios<DetailedPostType>({
        method: 'get',
        url: url,
    });
};

interface PostCommentRequestBody {
    arg: {
        postId: string;
        content: string;
        username: string;
    };
}

const postCommentRequest = async (
    url: string,
    { arg }: PostCommentRequestBody
) => {
    return axios<Comment>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const FullImageDisplayModal: FC<FullImageDisplayModalProps> = ({
    isOpen,
    onClose,
    postId,
    creatorName,
}) => {
    const { data } = useSWR(`/api/query/detail/${postId}`, fetchPostDetails);
    const { data: currentUserProfileData } = useGetCurrentUserProfile();
    const { trigger, isMutating } = useSWRMutation(
        `/api/comments`,
        postCommentRequest
    );

    const { mutate } = useSWRConfig();

    const [commentText, setCommentText] = useState<string>('');

    const swr = useAppSelector((state) => state.indexPaginatedSWR.swr);

    const postHandler = async () => {
        const username = currentUserProfileData?.data.username;
        if (!username) return;
        try {
            await trigger({
                content: commentText,
                postId: postId,
                username: username,
            });
            setCommentText('');
            swr?.mutate();
            mutate(`/api/query/detail/${postId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            isCentered
            size={'4xl'}
            onClose={onClose}
            isOpen={isOpen}
            scrollBehavior='inside'
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'} height='fit-content'>
                <ModalBody overflow={'hidden'}>
                    <Flex justifyContent={'stretch'} alignItems='stretch'>
                        <Box w={'50%'} mr={5} height='fit-content'>
                            <Image
                                rounded={'md'}
                                objectFit='cover'
                                src={data?.data.post.imageUrl}
                                alt={data?.data.post.caption}
                            />
                        </Box>
                        <Box w={'50%'} height='auto'>
                            <Box m={4}>
                                <Flex>
                                    <Avatar
                                        size={'sm'}
                                        name={creatorName}
                                        src={creatorName}
                                        mr={4}
                                    />
                                    <Text>{creatorName}</Text>
                                </Flex>
                            </Box>
                            <Divider />
                            <UnorderedList
                                overflow={'scroll'}
                                w='full'
                                height={'57%'}>
                                {data?.data.commentsAssociatedWithPost.map(
                                    (comment) => {
                                        return (
                                            <ListItem mb={4} key={comment.id}>
                                                <Flex
                                                    w={'full'}
                                                    justifyContent='flex-start'
                                                    alignItems={'center'}>
                                                    <Avatar
                                                        size={'sm'}
                                                        mr={5}
                                                    />
                                                    <Flex
                                                        justifyContent={
                                                            'space-between'
                                                        }>
                                                        <Text
                                                            color={ACCENT_COLOR}
                                                            mr={2}>
                                                            {comment.username}:{' '}
                                                        </Text>{' '}
                                                        <Text
                                                            letterSpacing={
                                                                'wide'
                                                            }
                                                            fontWeight='hairline'
                                                            maxW={'75%'}
                                                            mx='auto'>
                                                            {comment.content}
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </ListItem>
                                        );
                                    }
                                )}
                            </UnorderedList>
                            <CommentInputBar
                                setCommentText={setCommentText}
                                isLoading={isMutating}
                                postHandler={postHandler}
                                commentText={commentText}
                            />
                        </Box>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FullImageDisplayModal;

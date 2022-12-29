import {
    Avatar,
    Box,
    ButtonGroup,
    Divider,
    Flex,
    IconButton,
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
import { FC, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { useGetCurrentUserProfile } from '../hooks/use-get-current-user-profile';
import { useAppSelector } from '../hooks/use-redux';
import { ACCENT_COLOR } from '../styles/consts';
import { DetailedPostType } from '../types/post';
import CommentInputBar from './comment-input-bar';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

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

const postDeleteRequest = async (url: string) => {
    return axios({
        method: 'delete',
        url: url,
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
    const {
        trigger: createCommentTrigger,
        isMutating: createCommentIsMutating,
    } = useSWRMutation(`/api/comments`, postCommentRequest);

    const { trigger: deletePostTrigger, isMutating: deletePostIsMutating } =
        useSWRMutation(`/api/posts/${postId}`, postDeleteRequest);

    const [isSelf, setIsSelf] = useState(false);

    useEffect(() => {
        if (data?.data.post.userId === currentUserProfileData?.data.userId) {
            setIsSelf(true);
        }
    }, [currentUserProfileData?.data.userId, data?.data.post.userId]);

    const { mutate } = useSWRConfig();

    const [commentText, setCommentText] = useState<string>('');

    const swr = useAppSelector((state) => state.indexPaginatedSWR.swr);

    const postHandler = async () => {
        const username = currentUserProfileData?.data.username;
        if (!username) return;
        try {
            await createCommentTrigger({
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

    const deletePostHandler = async () => {
        try {
            await deletePostTrigger();
            onClose();
            mutate(`/api/query/${currentUserProfileData?.data.userId}`);
            swr?.mutate();
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
            <ModalContent bgColor={'black'} h='full'>
                <ModalBody overflow={'hidden'} h='full'>
                    <Flex h='full'>
                        <Box w={'50%'} mr={5} h='full'>
                            <Image
                                rounded={'md'}
                                w={'full'}
                                h={'full'}
                                objectFit='cover'
                                src={data?.data.post.imageUrl}
                                alt={data?.data.post.caption}
                            />
                        </Box>
                        <Flex
                            w={'50%'}
                            height='auto'
                            flexDir={'column'}
                            justifyContent='space-between'>
                            <Box mb={4}>
                                <Box m={4}>
                                    <Flex justifyContent={'space-between'}>
                                        <Flex>
                                            <Avatar
                                                size={'sm'}
                                                name={creatorName}
                                                src={creatorName}
                                                mr={4}
                                            />
                                            <Text>{creatorName}</Text>
                                        </Flex>
                                        {isSelf && (
                                            <ButtonGroup>
                                                <IconButton
                                                    aria-label={'edit'}
                                                    icon={<AiOutlineEdit />}
                                                />
                                                <IconButton
                                                    aria-label={'edit'}
                                                    onClick={deletePostHandler}
                                                    isLoading={
                                                        deletePostIsMutating
                                                    }
                                                    icon={<AiOutlineDelete />}
                                                />
                                            </ButtonGroup>
                                        )}
                                    </Flex>
                                </Box>
                                <Divider />
                            </Box>
                            <UnorderedList
                                overflow={'scroll'}
                                w='full'
                                h={'full'}>
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
                                isLoading={createCommentIsMutating}
                                postHandler={postHandler}
                                commentText={commentText}
                            />
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FullImageDisplayModal;

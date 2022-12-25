import { Text, Box, Flex, Avatar, ButtonGroup, Button } from '@chakra-ui/react';
import { FC } from 'react';
import { ACCENT_COLOR_LIGHT, ACCENT_COLOR } from '../styles/consts';
import { Profile } from '../types/profile';
import useSWRMutations from 'swr/mutation';
import axios from 'axios';
import { useGetCurrentUserProfile } from '../hooks/use-get-current-user-profile';
import { useRouter } from 'next/router';

interface FriendRequestModalBodyCardProps {
    friendRequest: Profile;
    onClose: () => void;
}

interface HandleFriendRequestBody {
    arg: {
        receiverId: string;
    };
}

const handleFriendRequest = async (
    url: string,
    { arg }: HandleFriendRequestBody
) => {
    return axios<Profile>({
        method: 'put',
        url,
        data: arg,
    });
};

const FriendRequestModalBodyCard: FC<FriendRequestModalBodyCardProps> = ({
    friendRequest,
    onClose,
}) => {
    const router = useRouter();

    const {
        trigger: triggerAcceptFriendRequest,
        isMutating: acceptFriendRequestIsMutating,
    } = useSWRMutations(
        `/api/profile/accept-friend-request/${friendRequest.userId}`,
        handleFriendRequest
    );

    const {
        trigger: triggerDeclineFriendRequest,
        isMutating: declineFriendRequestIsMutating,
    } = useSWRMutations(
        `/api/profile/decline-friend-request/${friendRequest.userId}`,
        handleFriendRequest
    );

    const { currentUser } = useGetCurrentUserProfile();

    const acceptFriendRequestHandler = async () => {
        try {
            if (!currentUser) return;
            await triggerAcceptFriendRequest({ receiverId: currentUser.id });
            onClose();
            router.push(`/profile/${friendRequest.userId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const declineFriendRequestHandler = async () => {
        try {
            if (!currentUser) return;
            await triggerDeclineFriendRequest({ receiverId: currentUser.id });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex justifyContent={'space-between'}>
            <Flex>
                <Avatar
                    mr={4}
                    name={friendRequest.username}
                    src={friendRequest.avatarUrl || friendRequest.username}
                />
                <Box>
                    <Text color={'gray.300'}>
                        {friendRequest.fullName || friendRequest.username}
                    </Text>
                    <Text
                        color={ACCENT_COLOR_LIGHT}
                        fontSize='md'
                        fontWeight={'thin'}>
                        {friendRequest.username}
                    </Text>
                </Box>
            </Flex>

            <ButtonGroup gap={4}>
                <Button
                    bgColor={ACCENT_COLOR}
                    color={'black'}
                    _hover={{
                        bgColor: ACCENT_COLOR_LIGHT,
                    }}
                    onClick={acceptFriendRequestHandler}
                    isLoading={acceptFriendRequestIsMutating}>
                    Accept
                </Button>
                <Button
                    bgColor={'transparent'}
                    color={ACCENT_COLOR}
                    variant='outline'
                    borderColor={ACCENT_COLOR}
                    onClick={declineFriendRequestHandler}
                    isLoading={declineFriendRequestIsMutating}>
                    Reject
                </Button>
            </ButtonGroup>
        </Flex>
    );
};

export default FriendRequestModalBodyCard;

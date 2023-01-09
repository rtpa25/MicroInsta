import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { ACCENT_COLOR_LIGHT } from '../styles/consts';
import { Profile } from '../types/profile';
import { useRouter } from 'next/router';

interface ShowAllFriendsModalBodyCardProps {
    friend: Profile;
    onClose: () => void;
}

const ShowAllFriendsModalBodyCard: FC<ShowAllFriendsModalBodyCardProps> = ({
    friend,
    onClose,
}) => {
    const router = useRouter();

    return (
        <Flex>
            <Avatar
                mr={4}
                name={friend.username}
                src={friend.avatarUrl || friend.username}
            />
            <Box
                onClick={() => {
                    router.push(`/profile/${friend.userId}`);
                    onClose();
                }}
                cursor='pointer'>
                <Text color={'gray.300'}>{friend.username}</Text>
                <Text
                    color={ACCENT_COLOR_LIGHT}
                    fontSize='md'
                    fontWeight={'thin'}>
                    {friend.username}
                </Text>
            </Box>
        </Flex>
    );
};

export default ShowAllFriendsModalBodyCard;

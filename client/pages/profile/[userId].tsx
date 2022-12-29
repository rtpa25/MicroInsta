import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    Heading,
    SimpleGrid,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AppBar from '../../components/app-bar';
import { requireAuth } from '../../components/hoc/require-auth';
import IndividualProfilePostPicture from '../../components/user-profile-post-pic';
import { useGetCurrentUser } from '../../hooks/use-get-current-user';
import { ACCENT_COLOR } from '../../styles/consts';
import { Profile } from '../../types/profile';
import { buildClient } from '../../utils/build-client';
import useSWRMutations from 'swr/mutation';
import axios from 'axios';
import useSWR from 'swr';
import { Post } from '../../types/post';
import ShowAllFriendsModal from '../../components/show-all-friends-modal';

interface UserProfileServerSideProps {
    profile: Profile;
}

interface AddFriendRequestBody {
    arg: {
        receiverId: string;
    };
}

const addFriendRequest = async (url: string, { arg }: AddFriendRequestBody) => {
    return axios<Profile>({
        method: 'put',
        url,
        data: arg,
    });
};

const fetchPostsByUserId = async (url: string) => {
    return axios<Post[]>({
        method: 'get',
        url,
    });
};

const UserProfile: NextPage<UserProfileServerSideProps> = ({ profile }) => {
    const router = useRouter();

    const [isSelfProfile, setIsSelfProfile] = useState<boolean>(false);
    const [isRequested, setIsRequested] = useState<boolean>(false);
    const [isFriend, setIsFriend] = useState<boolean>(false);

    const { currentUser } = useGetCurrentUser();

    useEffect(() => {
        if (currentUser?.id === profile.userId) {
            setIsSelfProfile(true);
        }

        profile.friendRequests.map((profile) => {
            if (profile.userId === currentUser?.id) {
                setIsRequested(true);
            }
        });

        profile.friends.map((profile) => {
            if (profile.userId === currentUser?.id) {
                setIsFriend(true);
            }
        });
    }, [currentUser, profile]);

    const selfProfileState = (
        <Button
            variant='outline'
            borderColor={ACCENT_COLOR}
            color={ACCENT_COLOR}
            onClick={() => router.push('/profile/edit')}>
            Edit Profile
        </Button>
    );

    const { trigger, isMutating } = useSWRMutations(
        `/api/profile/add-friend/${currentUser?.id}`,
        addFriendRequest
    );

    const addFriendHandler = async () => {
        try {
            const res = await trigger({ receiverId: profile.userId });
            res?.data.friendRequests.map((profile) => {
                if (profile.userId === currentUser?.id) {
                    setIsRequested(true);
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const otherProfileState = (
        <ButtonGroup gap={4}>
            <Button
                variant='outline'
                borderColor={ACCENT_COLOR}
                onClick={
                    !isFriend && !isRequested ? addFriendHandler : () => {}
                }
                isLoading={isMutating}
                color={ACCENT_COLOR}>
                {isRequested
                    ? 'Requested'
                    : isFriend
                    ? 'Friends'
                    : 'Add Friend'}
            </Button>
            <Button
                variant='outline'
                borderColor={ACCENT_COLOR}
                color={ACCENT_COLOR}>
                Message
            </Button>
        </ButtonGroup>
    );

    const renderProfileActionButtons = () => {
        if (isSelfProfile) {
            return selfProfileState;
        } else {
            return otherProfileState;
        }
    };

    const { data, isLoading, error } = useSWR(
        `/api/query/${profile.userId}`,
        fetchPostsByUserId
    );

    const { isOpen, onClose, onOpen } = useDisclosure();

    if (!profile) {
        return <div>Profile not found</div>;
    }

    return (
        <>
            <AppBar />
            <Box w={'full'}>
                <Flex
                    maxW={['100%', '75%', '60%', '50%']}
                    mx={'auto'}
                    alignItems='center'
                    my={[1, 10, 20]}>
                    <Box mr={['1.5', 10, 20]} ml={0}>
                        <Avatar
                            size={['lg', 'xl', '2xl']}
                            name={profile.username}
                            src={profile.avatarUrl || profile.username}
                        />
                    </Box>
                    <Box>
                        <Flex
                            mb={['1', '5', '10']}
                            flexDirection={['column', 'column', 'row']}
                            justifyContent={'space-between'}
                            alignItems={['flex-start', 'center']}>
                            <Box>
                                <Heading
                                    fontWeight={'normal'}
                                    color={ACCENT_COLOR}
                                    fontFamily='serif'
                                    fontSize={['xl', '2xl', '3xl', '4xl']}>
                                    {profile.username}
                                </Heading>
                                <Button
                                    onClick={onOpen}
                                    variant={'link'}
                                    color={'gray.400'}
                                    fontWeight='hairline'>
                                    {`${profile.username} has ${
                                        profile.friends.length
                                    } ${
                                        profile.friends.length === 1
                                            ? 'friend'
                                            : 'friends'
                                    }`}
                                </Button>
                            </Box>
                            {renderProfileActionButtons()}
                        </Flex>
                        <Text
                            flexWrap={'wrap'}
                            color='gray.400'
                            display={['none', 'block']}>
                            {profile.bio ||
                                'Describe something about yourself. You can set your bio by clicking on the edit profile button'}
                        </Text>
                    </Box>
                </Flex>
                <Divider maxW={'60%'} mx='auto' />
                <SimpleGrid
                    maxW={['75%', '60%', '55%']}
                    mx={'auto'}
                    my={['0', '3', '6', '7']}
                    spacing={'16'}
                    templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                    {data?.data.map((post) => {
                        return (
                            <IndividualProfilePostPicture
                                profile={profile}
                                key={post.id}
                                post={post}
                            />
                        );
                    })}
                </SimpleGrid>
                <ShowAllFriendsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    friends={profile.friends}
                />
            </Box>
        </>
    );
};

export const getServerSideProps = requireAuth(
    async ({ req, query }: GetServerSidePropsContext) => {
        const axiosClient = buildClient(req);

        const { userId } = query;

        try {
            const { data } = await axiosClient.get<Profile>(
                `/api/profile/${userId}`
            );

            return {
                props: {
                    profile: data,
                },
            };
        } catch (error) {
            return {
                props: {},
            };
        }
    }
);

export default UserProfile;

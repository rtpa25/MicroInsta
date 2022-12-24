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

interface UserProfileServerSideProps {
    profile: Profile;
}

const UserProfile: NextPage<UserProfileServerSideProps> = ({ profile }) => {
    const router = useRouter();

    const [isSelfProfile, setIsSelfProfile] = useState<boolean>(false);

    const { currentUser } = useGetCurrentUser();

    useEffect(() => {
        if (currentUser?.id === profile.userId) {
            setIsSelfProfile(true);
        }
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

    const otherProfileState = (
        <ButtonGroup gap={4}>
            <Button
                variant='outline'
                borderColor={ACCENT_COLOR}
                color={ACCENT_COLOR}>
                Add Friend
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
                                <Text color={'gray.400'} fontWeight='hairline'>
                                    {`${profile.username} has ${profile.friends.length} friends`}
                                </Text>
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
                    <IndividualProfilePostPicture />

                    <IndividualProfilePostPicture />
                    <IndividualProfilePostPicture />
                    <IndividualProfilePostPicture />
                </SimpleGrid>
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

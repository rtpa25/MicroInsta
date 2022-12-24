import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    IconButton,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiImageAdd, BiLogOutCircle } from 'react-icons/bi';
import { BsPersonPlus } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { useGetCurrentUser } from '../hooks/use-get-current-user';
import { ACCENT_COLOR_LIGHT } from '../styles/consts';
import CreatePostModal from './create-post-modal';
import HeaderLogo from './header-logo';
import NotificationsModal from './notifications-modal';
import ProfileSearchModal from './profile-search-modal';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';

const signoutRequest = async (url: string) => {
    return axios({
        method: 'post',
        url,
    });
};

const AppBar = () => {
    const {
        isOpen: createPostModalIsOpen,
        onOpen: cretePostModalOnOpen,
        onClose: createPostModalOnClose,
    } = useDisclosure();
    const {
        isOpen: profileSearchModalIsOpen,
        onOpen: profileSearchModalOnOpen,
        onClose: profileSearchModalOnClose,
    } = useDisclosure();
    const {
        isOpen: notificationModalIsOpen,
        onOpen: notificationModalOnOpen,
        onClose: notificationModalOnClose,
    } = useDisclosure();

    const router = useRouter();

    const { currentUser } = useGetCurrentUser();

    const { trigger, isMutating } = useSWRMutation(
        '/api/users/signout',
        signoutRequest
    );

    const logoutHandler = async () => {
        try {
            await trigger({});
            router.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box bgColor={'black'} w='full'>
            <Flex p='2.5' justifyContent={'space-between'} alignItems='center'>
                <Box>
                    <HeaderLogo isAppBarHeader={true} />
                </Box>
                <Flex w={'100%'}>
                    <Button
                        maxW={'2xl'}
                        w={['60%', '50%', '40%', '30%']}
                        variant='outline'
                        onClick={profileSearchModalOnOpen}
                        ml='auto'>
                        <Flex
                            alignItems={'center'}
                            justifyContent={'flex-start'}
                            w='full'>
                            <Box mr={'2.5'} color={ACCENT_COLOR_LIGHT}>
                                <AiOutlineSearch />
                            </Box>
                            <Text color='gray.300' fontWeight={'hairline'}>
                                Search...
                            </Text>
                        </Flex>
                    </Button>
                    <ButtonGroup>
                        <IconButton
                            size={'lg'}
                            variant={'ghost'}
                            onClick={cretePostModalOnOpen}
                            aria-label={'add post'}
                            icon={<BiImageAdd />}
                        />
                        <IconButton
                            size={'lg'}
                            variant={'ghost'}
                            aria-label={'friend requests'}
                            onClick={notificationModalOnOpen}
                            icon={<BsPersonPlus />}
                        />
                        <IconButton
                            size={'lg'}
                            variant={'ghost'}
                            onClick={() => {
                                router.push(`/profile/${currentUser?.id}`);
                            }}
                            aria-label={'profile-self'}
                            icon={<CgProfile />}
                        />
                        <IconButton
                            size={'lg'}
                            variant={'ghost'}
                            aria-label={'logout'}
                            isLoading={isMutating}
                            onClick={logoutHandler}
                            icon={<BiLogOutCircle />}
                        />
                    </ButtonGroup>
                </Flex>
            </Flex>
            <CreatePostModal
                isOpen={createPostModalIsOpen}
                onClose={createPostModalOnClose}
            />
            <ProfileSearchModal
                isOpen={profileSearchModalIsOpen}
                onClose={profileSearchModalOnClose}
            />
            <NotificationsModal
                isOpen={notificationModalIsOpen}
                onClose={notificationModalOnClose}
            />
        </Box>
    );
};

export default AppBar;

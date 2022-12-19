import {
    Box,
    Button,
    Flex,
    IconButton,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiOutlineHome, AiOutlineSearch } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { BsPersonPlus } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { ACCENT_COLOR_LIGHT } from '../styles/consts';
import CreatePostModal from './create-post-modal';
import HeaderLogo from './header-logo';
import NotificationsModal from './notifications-modal';
import ProfileSearchModal from './profile-search-modal';

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
                    <IconButton
                        size={'lg'}
                        variant={'ghost'}
                        aria-label={'home'}
                        icon={<AiOutlineHome />}
                    />
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
                            router.push('/profile/asd');
                        }}
                        aria-label={'profile-self'}
                        icon={<CgProfile />}
                    />
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

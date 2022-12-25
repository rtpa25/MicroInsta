import {
    Avatar,
    Box,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';
import { Profile } from '../types/profile';
import { useRouter } from 'next/router';

interface ProfileSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSearchModal: FC<ProfileSearchModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [searchedProfileUsername, setSearchedProfileUsername] = useState('');

    const [profiles, setProfiles] = useState<Profile[]>([]);

    const findProfiles = async (value: string) => {
        try {
            const { data } = await axios.get<Profile[]>(
                `/api/profile?username=${value}`
            );
            setProfiles(data);
        } catch (error) {
            console.error(error);
        }
    };

    const optimizedFn = useCallback(() => {
        const debounce = (
            func: (value: string) => Promise<void>,
            delay: number
        ) => {
            let timer: NodeJS.Timeout | null;

            return function (...args: any) {
                const context = this;
                if (timer) clearTimeout(timer);

                timer = setTimeout(() => {
                    timer = null;
                    func.apply(context, args);
                }, delay);
            };
        };
        return debounce(findProfiles, 500);
    }, [])();

    const router = useRouter();

    const renderProfiles =
        profiles.length > 0 ? (
            profiles.map((profile) => {
                return (
                    <Flex
                        key={profile.userId}
                        cursor='pointer'
                        my='4'
                        onClick={() => {
                            onClose();
                            router.push(`/profile/${profile.userId}`);
                        }}>
                        <Avatar
                            mr={4}
                            name={profile.username}
                            src={profile.avatarUrl || profile.username}
                        />
                        <Box>
                            <Text color={'gray.300'}>
                                {profile.fullName || profile.username}
                            </Text>
                            <Text
                                color={ACCENT_COLOR_LIGHT}
                                fontSize='md'
                                fontWeight={'thin'}>
                                {profile.username}
                            </Text>
                        </Box>
                    </Flex>
                );
            })
        ) : (
            <Box>No such profile found</Box>
        );

    return (
        <Modal
            size={'3xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'} height='70vh'>
                <ModalHeader>
                    <Input
                        py={5}
                        type='text'
                        value={searchedProfileUsername}
                        onChange={(e) => {
                            setSearchedProfileUsername(e.target.value);
                            optimizedFn(e.target.value);
                        }}
                        _highlighted={{ color: ACCENT_COLOR_LIGHT }}
                        focusBorderColor={'none'}
                        placeholder='Search...'
                        color={'gray.200'}
                        _focus={{
                            borderColor: ACCENT_COLOR,
                        }}
                        _placeholder={{ color: 'gray.200' }}
                    />
                </ModalHeader>
                <ModalBody h={'80%'}>
                    <Box overflow={'scroll'} h='full'>
                        {renderProfiles}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ProfileSearchModal;

import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
import { ACCENT_COLOR } from '../styles/consts';
import { Profile } from '../types/profile';
import ShowAllFriendsModalBodyCard from './show-all-friends-modal-body-card';

interface ShowAllFriendsModalProps {
    isOpen: boolean;
    onClose: () => void;
    friends: Profile[];
}

const ShowAllFriendsModal: FC<ShowAllFriendsModalProps> = ({
    isOpen,
    onClose,
    friends,
}) => {
    return (
        <Modal
            size={'3xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'} height='70vh'>
                <ModalHeader
                    fontSize='4xl'
                    fontWeight={'thin'}
                    fontFamily={'serif'}
                    color={ACCENT_COLOR}>
                    Friends List
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY={'scroll'}>
                    {friends.length > 0 ? (
                        friends.map((friend) => {
                            return (
                                <ShowAllFriendsModalBodyCard
                                    key={friend.userId}
                                    friend={friend}
                                    onClose={onClose}
                                />
                            );
                        })
                    ) : (
                        <Box>No friends for now</Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ShowAllFriendsModal;

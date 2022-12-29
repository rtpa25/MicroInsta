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
import FriendRequestModalBodyCard from './friend-request-modal-body-card';

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    friendRequests: Profile[];
}

const NotificationsModal: FC<NotificationsModalProps> = ({
    isOpen,
    onClose,
    friendRequests,
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
                    Friend Requests
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY={'scroll'}>
                    {friendRequests.length > 0 ? (
                        friendRequests?.map((friendRequest) => {
                            return (
                                <FriendRequestModalBodyCard
                                    onClose={onClose}
                                    friendRequest={friendRequest}
                                    key={friendRequest.userId}
                                />
                            );
                        })
                    ) : (
                        <Box>No friend requests for now</Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NotificationsModal;

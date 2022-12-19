import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
} from '@chakra-ui/react';

import { FC } from 'react';

interface UpdateProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateProfilePictureModal: FC<UpdateProfilePictureModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal
            isCentered
            size={'xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'}>
                <ModalHeader>Update Profile Picture</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack>
                        <Button>Remove profile picture</Button>
                        <Button>Add new profile picture</Button>
                        <Button>Discard</Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UpdateProfilePictureModal;

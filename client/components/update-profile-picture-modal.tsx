import {
    Box,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FC } from 'react';
import { v4 } from 'uuid';
import { ACCENT_COLOR } from '../styles/consts';
import { storage } from '../utils/firebase';

interface UpdateProfilePictureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreationOfImageUrl: (url: string) => void;
}

const UpdateProfilePictureModal: FC<UpdateProfilePictureModalProps> = ({
    isOpen,
    onClose,
    onCreationOfImageUrl,
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
                    <Box mt={'10'} w='full'>
                        <Input
                            type={'file'}
                            variant='flushed'
                            bgColor={'transparent'}
                            color={ACCENT_COLOR}
                            onChange={(e) => {
                                const imageRef = ref(
                                    storage,
                                    `images/${e.target.files![0].name + v4()}`
                                );
                                uploadBytes(imageRef, e.target.files![0]).then(
                                    (snapshot) => {
                                        getDownloadURL(snapshot.ref).then(
                                            (url) => onCreationOfImageUrl(url)
                                        );
                                    }
                                );
                            }}
                        />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UpdateProfilePictureModal;

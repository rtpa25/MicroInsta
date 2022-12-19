import {
    Box,
    Button,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Form, Formik } from 'formik';
import { FC, useState } from 'react';
import { v4 } from 'uuid';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';
import { storage } from '../utils/firebase';
import InputField from './input-field';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePostModal: FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
    const [imageUrl, setImageUrl] = useState<string>('');

    return (
        <Modal
            isCentered
            size={'3xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'}>
                <ModalHeader
                    mx={'4%'}
                    fontSize='4xl'
                    fontWeight={'thin'}
                    fontFamily={'serif'}
                    color={ACCENT_COLOR}>
                    Create Post
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Formik initialValues={{ caption: '' }} onSubmit={() => {}}>
                        {({ isSubmitting }) => (
                            <Box mx={'5%'} mb={'2%'}>
                                <Form>
                                    <Box mt={4}>
                                        <InputField
                                            name={'caption'}
                                            placeholder={'caption'}
                                            label={'Caption'}
                                            type={'text'}
                                            color={ACCENT_COLOR}
                                            textArea={true}
                                            isPassword={false}
                                            showFormLabel={true}
                                        />
                                    </Box>

                                    <Box mt={'10'} w='full'>
                                        <Input
                                            type={'file'}
                                            variant='flushed'
                                            bgColor={'transparent'}
                                            color={ACCENT_COLOR}
                                            onChange={(e) => {
                                                const imageRef = ref(
                                                    storage,
                                                    `images/${
                                                        e.target.files![0]
                                                            .name + v4()
                                                    }`
                                                );
                                                uploadBytes(
                                                    imageRef,
                                                    e.target.files![0]
                                                ).then((snapshot) => {
                                                    getDownloadURL(
                                                        snapshot.ref
                                                    ).then((url) => {
                                                        setImageUrl(url);
                                                    });
                                                });
                                            }}
                                        />
                                    </Box>
                                    <Flex
                                        justifyContent={'space-between'}
                                        alignItems='baseline'>
                                        <Button
                                            mt={10}
                                            type='submit'
                                            isLoading={isSubmitting}
                                            color={ACCENT_COLOR}
                                            borderColor={ACCENT_COLOR}
                                            variant={'outline'}>
                                            Create
                                        </Button>
                                        <Text color={'gray.400'}>
                                            Changed your mind?{' '}
                                            <Button
                                                color={ACCENT_COLOR_LIGHT}
                                                variant='link'
                                                onClick={onClose}>
                                                Home
                                            </Button>
                                        </Text>
                                    </Flex>
                                </Form>
                            </Box>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CreatePostModal;

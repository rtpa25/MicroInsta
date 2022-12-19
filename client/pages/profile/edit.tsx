import {
    Avatar,
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import AppBar from '../../components/app-bar';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../../styles/consts';
import { Formik, Form } from 'formik';
import AccentOutlineButton from '../../components/accent-outline-buttons';
import InputField from '../../components/input-field';
import UpdateProfilePictureModal from '../../components/update-profile-picture-modal';

const Edit = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Box>
            <AppBar />
            <Box h={'80vh'} maxW={'60%'} mx='auto' bgColor='black' mt={10}>
                <Flex maxW='75%' mx={'auto'} pt={10} alignItems='center'>
                    <Box mr={10}>
                        <Avatar size={'lg'} />
                    </Box>
                    <Box>
                        <Heading
                            fontWeight={'normal'}
                            color={ACCENT_COLOR}
                            fontFamily='serif'
                            fontSize={['xl', '2xl', '3xl', '4xl']}>
                            Ronit Panda
                        </Heading>
                        <Button
                            variant={'link'}
                            color='blue.400'
                            onClick={onOpen}>
                            Change profile photo
                        </Button>
                    </Box>
                </Flex>
                <Formik
                    initialValues={{
                        username: '',
                        fullname: '',
                        bio: '',
                    }}
                    onSubmit={async (values, { setErrors }) => {}}>
                    {({ isSubmitting }) => (
                        <Box maxW='75%' mx={'auto'} pt={10}>
                            <Form>
                                <Box>
                                    <InputField
                                        name={'username'}
                                        placeholder={'username'}
                                        label={'Username'}
                                        type={'text'}
                                        isPassword={false}
                                        showFormLabel={true}
                                    />
                                </Box>
                                <Box mt={4}>
                                    <InputField
                                        name={'fullname'}
                                        placeholder={'fullname'}
                                        label={'Full Name'}
                                        type={'text'}
                                        isPassword={false}
                                        showFormLabel={true}
                                    />
                                </Box>
                                <Box mt={4}>
                                    <InputField
                                        name={'bio'}
                                        placeholder={'bio'}
                                        label={'Bio'}
                                        type={'text'}
                                        textArea={true}
                                        isPassword={false}
                                        showFormLabel={true}
                                    />
                                </Box>
                                <Flex
                                    justifyContent={'space-between'}
                                    alignItems='baseline'>
                                    <AccentOutlineButton
                                        mt={10}
                                        buttonText={'Save'}
                                        isLoading={isSubmitting}
                                    />
                                    <Text>
                                        {'Changed your mind? go'}{' '}
                                        <Link
                                            href={'/home'}
                                            color={ACCENT_COLOR_LIGHT}>
                                            Home
                                        </Link>
                                    </Text>
                                </Flex>
                            </Form>
                        </Box>
                    )}
                </Formik>
            </Box>
            <UpdateProfilePictureModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};

export default Edit;

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
import axios from 'axios';
import { Form, Formik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import AppBar from '../../components/app-bar';
import { requireAuth } from '../../components/hoc/require-auth';
import InputField from '../../components/input-field';
import UpdateProfilePictureModal from '../../components/update-profile-picture-modal';
import { useGetCurrentUser } from '../../hooks/use-get-current-user';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../../styles/consts';
import { Profile } from '../../types/profile';
import { toErrorMap } from '../../utils/to-error-map';

interface EditProfileRequestBody {
    arg: {
        fullName: string;
        bio: string;
        avatarUrl: string;
    };
}

const editProfileRequest = async (
    url: string,
    { arg }: EditProfileRequestBody
) => {
    return axios<Profile>({
        method: 'put',
        url,
        data: arg,
    });
};

const fetchProfileRequest = async (url: string) => {
    return axios<Profile>({
        method: 'get',
        url,
    });
};

const Edit = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [imageUrl, setImageUrl] = useState<string>('');

    const { currentUser } = useGetCurrentUser();

    const { trigger, isMutating } = useSWRMutation(
        `/api/profile/${currentUser?.id}`,
        editProfileRequest
    );

    const { data } = useSWR(
        `/api/profile/${currentUser?.id}`,
        fetchProfileRequest
    );

    const router = useRouter();

    return (
        <Box>
            <AppBar />
            <Box maxW={'60%'} mx='auto' bgColor='black' my={10}>
                <Flex maxW='75%' mx={'auto'} pt={10} alignItems='center'>
                    <Box mr={10}>
                        <Avatar
                            size={'lg'}
                            src={data?.data.avatarUrl || data?.data.username}
                            name={data?.data.username}
                        />
                    </Box>
                    <Box>
                        <Heading
                            fontWeight={'normal'}
                            color={ACCENT_COLOR}
                            fontFamily='serif'
                            fontSize={['xl', '2xl', '3xl', '4xl']}>
                            {currentUser?.username}
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
                        fullName: data?.data.fullName || '',
                        bio: data?.data.bio || '',
                    }}
                    onSubmit={async (values, { setErrors }) => {
                        const { fullName, bio } = values;
                        if (imageUrl === '' && !data?.data.avatarUrl) {
                            setErrors({
                                fullName: 'Please upload a profile picture',
                            });
                        }
                        try {
                            await trigger({
                                avatarUrl:
                                    imageUrl ||
                                    (data?.data.avatarUrl as string),
                                fullName,
                                bio,
                            });
                            router.push(`/profile/${currentUser?.id}`);
                        } catch (error: any) {
                            setErrors(toErrorMap(error.response.data.errors));
                        }
                    }}>
                    {({ isSubmitting }) => (
                        <Box maxW='75%' mx={'auto'} py={10}>
                            <Form>
                                <Box>
                                    <InputField
                                        name={'fullName'}
                                        placeholder={'fullName'}
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
                                    <Button
                                        variant='outline'
                                        borderColor={ACCENT_COLOR}
                                        color={ACCENT_COLOR}
                                        isLoading={isMutating || isSubmitting}
                                        type='submit'
                                        mt={10}>
                                        Save
                                    </Button>
                                    <Text>
                                        {'Changed your mind? go'}{' '}
                                        <Link
                                            href={'/'}
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
            <UpdateProfilePictureModal
                isOpen={isOpen}
                onClose={onClose}
                onCreationOfImageUrl={(url: string) => {
                    setImageUrl(url);
                }}
            />
        </Box>
    );
};

export const getServerSideProps = requireAuth(
    async ({ req }: GetServerSidePropsContext) => {
        return {
            props: {},
        };
    }
);

export default Edit;

import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import AppBar from '../../components/app-bar';
import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../../components/hoc/require-auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Formik, Form } from 'formik';
import { v4 } from 'uuid';
import InputField from '../../components/input-field';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../../styles/consts';
import { storage } from '../../utils/firebase';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/use-redux';
import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { Post } from '../../types/post';
import { useRouter } from 'next/router';

interface CreatePostRequestBody {
    arg: {
        imageUrl: string;
        caption?: string | undefined;
    };
}

const createPostRequest = async (
    url: string,
    { arg }: CreatePostRequestBody
) => {
    return axios<Post>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const CreatePost = () => {
    const [imageUrl, setImageUrl] = useState<string>('');

    const { trigger, isMutating } = useSWRMutation(
        '/api/posts',
        createPostRequest
    );

    const swr = useAppSelector((state) => state.indexPaginatedSWR.swr);

    const router = useRouter();

    return (
        <Box>
            <AppBar />
            <Flex justifyContent={'center'} alignItems='center' h={'90vh'}>
                <Box
                    bgColor={'black'}
                    w={['100%', '90%', '80%', '70%']}
                    px={4}
                    py={10}>
                    <Heading
                        mx={'4%'}
                        fontSize='4xl'
                        fontWeight={'thin'}
                        fontFamily={'serif'}
                        color={ACCENT_COLOR}>
                        Create Post
                    </Heading>
                    <Formik
                        initialValues={{ caption: '' }}
                        onSubmit={async (values, { setErrors }) => {
                            const { caption } = values;
                            if (!imageUrl) {
                                setErrors({
                                    caption: 'Please upload an image',
                                });
                            }
                            try {
                                await trigger({ imageUrl, caption });
                                router.push('/');
                                swr?.mutate();
                            } catch (error) {
                                setErrors({ caption: 'Something went wrong' });
                            }
                        }}>
                        {({ isSubmitting }) => (
                            <Box mx={'5%'} mb={'2%'}>
                                <Form>
                                    <Box mt={4}>
                                        <InputField
                                            name={'caption'}
                                            placeholder={'caption'}
                                            label={'Caption'}
                                            type={'text'}
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
                                            isLoading={
                                                isMutating || isSubmitting
                                            }
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
                                                onClick={() =>
                                                    router.push('/')
                                                }>
                                                Home
                                            </Button>
                                        </Text>
                                    </Flex>
                                </Form>
                            </Box>
                        )}
                    </Formik>
                </Box>
            </Flex>
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

export default CreatePost;

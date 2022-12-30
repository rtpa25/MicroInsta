import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import AppBar from '../../../components/app-bar';
import { requireAuth } from '../../../components/hoc/require-auth';
import InputField from '../../../components/input-field';
import { useAppSelector } from '../../../hooks/use-redux';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../../../styles/consts';

interface EditPostRequestBody {
    arg: {
        caption: string;
    };
}

const editPostRequest = async (url: string, { arg }: EditPostRequestBody) => {
    return axios({
        method: 'put',
        url: url,
        data: arg,
    });
};

const EditPost = () => {
    const router = useRouter();

    const { trigger, isMutating } = useSWRMutation(
        `/api/posts/${router.query.postId}`,
        editPostRequest
    );

    const swr = useAppSelector((state) => state.indexPaginatedSWR.swr);

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
                        Update Post
                    </Heading>
                    <Formik
                        initialValues={{ caption: '' }}
                        onSubmit={async (values, { setErrors }) => {
                            const { caption } = values;

                            try {
                                await trigger({ caption });
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

                                    <Flex
                                        justifyContent={'space-between'}
                                        alignItems='baseline'>
                                        <Button
                                            mt={10}
                                            type='submit'
                                            isLoading={
                                                isSubmitting || isMutating
                                            }
                                            color={ACCENT_COLOR}
                                            borderColor={ACCENT_COLOR}
                                            variant={'outline'}>
                                            Update
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

export default EditPost;

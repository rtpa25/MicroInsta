import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import AccentOutlineButton from '../../components/accent-outline-buttons';
import HeaderLogo from '../../components/header-logo';
import InputField from '../../components/input-field';
import { ACCENT_COLOR_LIGHT } from '../../styles/consts';
import { User } from '../../types/user';
import { toErrorMap } from '../../utils/to-error-map';

interface SignupRequestBody {
    arg: {
        username: string;
        password: string;
        email: string;
    };
}

const signupRequest = async (url: string, { arg }: SignupRequestBody) => {
    return axios<User>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const SignUp = () => {
    const { trigger } = useSWRMutation('/api/users/signup', signupRequest);
    const router = useRouter();

    const submitHandler = async (
        values: SignupRequestBody['arg'],
        {
            setErrors,
        }: {
            setErrors: (errors: FormikErrors<SignupRequestBody['arg']>) => void;
        }
    ) => {
        const { email, password, username } = values;
        try {
            await trigger({ email, password, username });
            router.push('/');
        } catch (error: any) {
            setErrors(toErrorMap(error.response.data.errors));
        }
    };

    return (
        <Flex
            justifyContent={'center'}
            alignItems={'center'}
            h='100vh'
            flexDirection={'column'}
            w={'full'}
            textAlign={'center'}>
            <Stack spacing={'0.5'}>
                <HeaderLogo isAppBarHeader={false} />
                <Heading fontSize={'4xl'} fontWeight='normal'>
                    Signup to a new account
                </Heading>
            </Stack>
            <Box
                shadow={'2xl'}
                w={['90%', '70%', '50%', '40%']}
                bgColor={'black'}
                mt='10'
                p='10'>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        email: '',
                    }}
                    onSubmit={submitHandler}>
                    {({ isSubmitting }) => (
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
                                    name={'email'}
                                    placeholder={'email'}
                                    label={'Email'}
                                    type={'email'}
                                    isPassword={false}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name={'password'}
                                    placeholder={'password'}
                                    label={'Password'}
                                    type={'password'}
                                    isPassword={true}
                                    showFormLabel={true}
                                />
                            </Box>
                            <Flex
                                justifyContent={'space-between'}
                                alignItems='baseline'>
                                <AccentOutlineButton
                                    mt={10}
                                    buttonText={'Register'}
                                    isLoading={isSubmitting}
                                />
                                <Text>
                                    Have an account?{' '}
                                    <Link
                                        href={'/auth/signin'}
                                        color={ACCENT_COLOR_LIGHT}>
                                        SignIn
                                    </Link>
                                </Text>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Flex>
    );
};

export default SignUp;

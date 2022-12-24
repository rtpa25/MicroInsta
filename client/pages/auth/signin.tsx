import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { Form, Formik, FormikErrors } from 'formik';
import { useRouter } from 'next/router';
import useSWRMutation from 'swr/mutation';
import HeaderLogo from '../../components/header-logo';
import InputField from '../../components/input-field';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../../styles/consts';
import { User } from '../../types/user';
import { toErrorMap } from '../../utils/to-error-map';

interface SigninRequestBody {
    arg: {
        password: string;
        email: string;
    };
}

const signinRequest = async (url: string, { arg }: SigninRequestBody) => {
    return axios<User>({
        method: 'post',
        url: url,
        data: arg,
    });
};

const SignIn = () => {
    const { trigger } = useSWRMutation('/api/users/signin', signinRequest);
    const router = useRouter();

    const submitHandler = async (
        values: SigninRequestBody['arg'],
        {
            setErrors,
        }: {
            setErrors: (errors: FormikErrors<SigninRequestBody['arg']>) => void;
        }
    ) => {
        const { email, password } = values;
        try {
            await trigger({ email, password });
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
                    Log in to your account
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
                        password: '',
                        email: '',
                    }}
                    onSubmit={submitHandler}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Box>
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
                                <Button
                                    mt={10}
                                    type='submit'
                                    variant='outline'
                                    borderColor={ACCENT_COLOR}
                                    color={ACCENT_COLOR}
                                    isLoading={isSubmitting}>
                                    Login
                                </Button>
                                <Text>
                                    {"Don't have an account?"}{' '}
                                    <Link
                                        href={'/auth/signup'}
                                        color={ACCENT_COLOR_LIGHT}>
                                        SignUp
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

export default SignIn;

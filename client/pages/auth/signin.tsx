import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import InputField from '../../components/input-field';
import {
    ACCENT_COLOR,
    ACCENT_COLOR_LIGHT,
    FORM_BG_COLOR,
} from '../../styles/consts';
import AccentOutlineButton from '../../components/accent-outline-buttons';
import HeaderLogo from '../../components/header-logo';

const SignIn = () => {
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
                    onSubmit={async (values, { setErrors }) => {}}>
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
                                <AccentOutlineButton
                                    mt={10}
                                    buttonText={'Login'}
                                    isLoading={isSubmitting}
                                />
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

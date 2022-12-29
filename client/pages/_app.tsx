import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from '../theme';
import { Provider } from 'react-redux';
import { store } from '../store';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
};

export default MyApp;

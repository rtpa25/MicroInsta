import { Heading } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ACCENT_COLOR } from '../styles/consts';
import { useRouter } from 'next/router';

interface HeaderLogoProps {
    isAppBarHeader: boolean;
}

const HeaderLogo: FC<HeaderLogoProps> = ({ isAppBarHeader }) => {
    const router = useRouter();
    return (
        <Heading
            fontFamily={'serif'}
            fontWeight={'medium'}
            cursor={'pointer'}
            color={ACCENT_COLOR}
            onClick={() => {
                router.push('/');
                router.reload();
            }}
            display={isAppBarHeader ? ['none', 'block', 'block'] : 'block'}
            fontSize={['3xl', '4xl']}>
            MicroInsta
        </Heading>
    );
};

export default HeaderLogo;

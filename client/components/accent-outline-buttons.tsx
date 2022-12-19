import { Button } from '@chakra-ui/react';
import React, { ButtonHTMLAttributes, FC } from 'react';
import { ACCENT_COLOR } from '../styles/consts';

interface AccentOutlineButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean | undefined;
    buttonText: string;
    mt?: number | undefined;
    mb?: number | undefined;
    ml?: number | undefined;
    mr?: number | undefined;
}

const AccentOutlineButton: FC<AccentOutlineButtonProps> = ({
    type,
    isLoading,
    buttonText,
    mt,
    mb,
    ml,
    mr,
}) => {
    return (
        <Button
            mt={mt}
            ml={ml}
            mb={mb}
            mr={mr}
            type={type}
            variant='outline'
            borderColor={ACCENT_COLOR}
            color={ACCENT_COLOR}
            isLoading={isLoading}>
            {buttonText}
        </Button>
    );
};

export default AccentOutlineButton;

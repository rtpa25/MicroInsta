import { Box, Image, useDisclosure } from '@chakra-ui/react';
import FullImageDisplayModal from './full-post-display-modal';

const IndividualProfilePostPicture = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box>
                <Image
                    objectFit='cover'
                    src='https://bit.ly/dan-abramov'
                    alt='Dan Abramov'
                    onClick={onOpen}
                />
            </Box>
            <FullImageDisplayModal onClose={onClose} isOpen={isOpen} />
        </>
    );
};

export default IndividualProfilePostPicture;

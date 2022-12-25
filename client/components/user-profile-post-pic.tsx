import { Box, Image, useDisclosure } from '@chakra-ui/react';
import FullImageDisplayModal from './full-post-display-modal';
import { Post } from '../types/post';
import { FC } from 'react';

interface IndividualProfilePostPictureProps {
    post: Post;
}

const IndividualProfilePostPicture: FC<IndividualProfilePostPictureProps> = ({
    post,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box>
                <Image
                    objectFit='cover'
                    src={post.imageUrl}
                    alt={post.caption}
                    onClick={onOpen}
                />
            </Box>
            <FullImageDisplayModal onClose={onClose} isOpen={isOpen} />
        </>
    );
};

export default IndividualProfilePostPicture;

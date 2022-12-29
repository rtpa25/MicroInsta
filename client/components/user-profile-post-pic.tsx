import { Box, Image, useDisclosure } from '@chakra-ui/react';
import FullImageDisplayModal from './full-post-display-modal';
import { Post } from '../types/post';
import { FC } from 'react';
import { Profile } from '../types/profile';

interface IndividualProfilePostPictureProps {
    post: Post;
    profile: Profile;
}

const IndividualProfilePostPicture: FC<IndividualProfilePostPictureProps> = ({
    post,
    profile,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box boxSize={'-moz-fit-content'}>
                <Image
                    objectFit='cover'
                    boxSize={'300px'}
                    src={post.imageUrl}
                    alt={post.caption}
                    onClick={onOpen}
                />
            </Box>
            <FullImageDisplayModal
                creatorName={profile.username}
                onClose={onClose}
                isOpen={isOpen}
                postId={post.id}
            />
        </>
    );
};

export default IndividualProfilePostPicture;

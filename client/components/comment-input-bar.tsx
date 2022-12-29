import {
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    Button,
} from '@chakra-ui/react';
import { AiOutlineSmile } from 'react-icons/ai';
import { ACCENT_COLOR_LIGHT, ACCENT_COLOR } from '../styles/consts';
import { FC } from 'react';

interface CommentInputBarProps {
    setCommentText: (text: string) => void;
    postHandler: () => Promise<void>;
    isLoading: boolean;
    commentText: string;
}

const CommentInputBar: FC<CommentInputBarProps> = ({
    setCommentText,
    postHandler,
    isLoading,
    commentText,
}) => {
    return (
        <InputGroup>
            <InputLeftElement pointerEvents='none' color={ACCENT_COLOR_LIGHT}>
                <AiOutlineSmile />
            </InputLeftElement>
            <Input
                py={5}
                type='text'
                _highlighted={{ color: ACCENT_COLOR_LIGHT }}
                focusBorderColor={'none'}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Add a comment...'
                color={'gray.200'}
                _placeholder={{ color: 'gray.200' }}
            />
            <InputRightElement>
                <Button
                    isLoading={isLoading}
                    variant={'ghost'}
                    color={ACCENT_COLOR}
                    onClick={postHandler}>
                    Post
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default CommentInputBar;

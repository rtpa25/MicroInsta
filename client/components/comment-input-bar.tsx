import {
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    Button,
} from '@chakra-ui/react';
import { AiOutlineSmile } from 'react-icons/ai';
import { ACCENT_COLOR_LIGHT, ACCENT_COLOR } from '../styles/consts';

const CommentInputBar = () => {
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
                placeholder='Add a comment...'
                color={'gray.200'}
                _placeholder={{ color: 'gray.200' }}
            />
            <InputRightElement>
                <Button variant={'ghost'} color={ACCENT_COLOR}>
                    Post
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default CommentInputBar;

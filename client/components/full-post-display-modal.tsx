import {
    Modal,
    ModalOverlay,
    ModalContent,
    Image,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Flex,
    Box,
    UnorderedList,
    ListItem,
    Avatar,
    Text,
    InputLeftElement,
    InputGroup,
    Input,
    InputRightElement,
    Divider,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import Autosizer from 'react-virtualized-auto-sizer';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';
import { AiOutlineSmile } from 'react-icons/ai';
import AccentOutlineButton from './accent-outline-buttons';
import CommentInputBar from './comment-input-bar';

interface FullImageDisplayModalProps {
    onClose: () => void;
    isOpen: boolean;
}

function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
        <ListItem key={index} style={style}>
            <Box>
                <Flex
                    w={'full'}
                    justifyContent='flex-start'
                    alignItems={'center'}>
                    <Avatar size={'sm'} mr={5} />
                    <Flex justifyContent={'space-between'}>
                        <Text color={ACCENT_COLOR} mr={2}>
                            Ronit Panda:{' '}
                        </Text>{' '}
                        <Text
                            letterSpacing={'wide'}
                            fontWeight='hairline'
                            maxW={'75%'}
                            mx='auto'>
                            Lorem ipsum dolor sit, amet
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </ListItem>
    );
}

const FullImageDisplayModal: FC<FullImageDisplayModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal
            isCentered
            size={'5xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'}>
                <ModalBody>
                    <Flex>
                        <Box flex={1} boxSize='-moz-fit-content' mr={5}>
                            <Image
                                rounded={'md'}
                                objectFit='cover'
                                src='https://images.unsplash.com/photo-1670843632632-b391a249734a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80'
                                alt='Dan Abramov'
                            />
                        </Box>
                        <Box flex={1}>
                            <Box m={4}>
                                <Flex>
                                    <Avatar
                                        size={'sm'}
                                        name='Dan Abrahmov'
                                        src='https://bit.ly/dan-abramov'
                                        mr={4}
                                    />
                                    <Text>Dan Abrahmov</Text>
                                </Flex>
                            </Box>
                            <Divider />
                            <UnorderedList
                                overflow={'scroll'}
                                zIndex={10}
                                w='full'
                                h='85%'
                                scrollBehavior='auto'>
                                <Autosizer>
                                    {({ height, width }) => (
                                        <List
                                            height={height}
                                            width={width}
                                            itemSize={50}
                                            itemCount={23}
                                            overscanCount={5}>
                                            {renderRow}
                                        </List>
                                    )}
                                </Autosizer>
                            </UnorderedList>
                            <CommentInputBar />
                        </Box>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default FullImageDisplayModal;

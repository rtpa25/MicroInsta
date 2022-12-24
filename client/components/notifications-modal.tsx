import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import Autosizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
        <Box key={index} style={style}>
            <Flex justifyContent={'space-between'}>
                <Flex>
                    <Avatar mr={4} />
                    <Box>
                        <Text color={'gray.300'}>Ronit Panda</Text>
                        <Text
                            color={ACCENT_COLOR_LIGHT}
                            fontSize='md'
                            fontWeight={'thin'}>
                            ronitpanda
                        </Text>
                    </Box>
                </Flex>

                <ButtonGroup gap={4}>
                    <Button
                        bgColor={ACCENT_COLOR}
                        color={'black'}
                        variant='outline'
                        _hover={{
                            bgColor: 'transparent',
                            borderColor: ACCENT_COLOR,
                            color: ACCENT_COLOR,
                        }}>
                        Accept
                    </Button>
                    <Button
                        bgColor={'transparent'}
                        color={ACCENT_COLOR}
                        variant='outline'
                        borderColor={ACCENT_COLOR}
                        _hover={{
                            bgColor: ACCENT_COLOR,
                            color: 'black',
                        }}>
                        Reject
                    </Button>
                </ButtonGroup>
            </Flex>
        </Box>
    );
}

const NotificationsModal: FC<NotificationsModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Modal
            size={'3xl'}
            onClose={onClose}
            isOpen={isOpen}
            motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent bgColor={'black'} height='70vh'>
                <ModalHeader
                    fontSize='4xl'
                    fontWeight={'thin'}
                    fontFamily={'serif'}
                    color={ACCENT_COLOR}>
                    Friend Requests
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Autosizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                width={width}
                                itemSize={80}
                                itemCount={23}
                                overscanCount={5}>
                                {renderRow}
                            </List>
                        )}
                    </Autosizer>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NotificationsModal;

import {
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Box,
    Flex,
    Avatar,
    Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { ACCENT_COLOR, ACCENT_COLOR_LIGHT } from '../styles/consts';
import Autosizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

interface ProfileSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
        <Box key={index} style={style}>
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
        </Box>
    );
}

const ProfileSearchModal: FC<ProfileSearchModalProps> = ({
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
                <ModalHeader>
                    <Input
                        py={5}
                        type='text'
                        _highlighted={{ color: ACCENT_COLOR_LIGHT }}
                        focusBorderColor={'none'}
                        placeholder='Search...'
                        color={'gray.200'}
                        _focus={{
                            borderColor: ACCENT_COLOR,
                        }}
                        _placeholder={{ color: 'gray.200' }}
                    />
                </ModalHeader>
                <ModalBody h={'full'}>
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

export default ProfileSearchModal;

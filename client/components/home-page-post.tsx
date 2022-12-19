import {
    Box,
    Flex,
    Stack,
    Avatar,
    Text,
    Image,
    IconButton,
    Link,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { ACCENT_COLOR_LIGHT } from '../styles/consts';
import CommentInputBar from './comment-input-bar';
import { BsBookmarkCheck, BsSuitHeart, BsChatRight } from 'react-icons/bs';

interface HomePagePostProps {
    onOpen: () => void;
}

const HomePagePost: FC<HomePagePostProps> = ({ onOpen }) => {
    return (
        <Box
            maxW={['100%', '80%', '60%', '40%']}
            height={'85%'}
            mx='auto'
            mt={10}
            bgColor='black'
            rounded={'md'}
            pt={3}>
            <Stack h={'full'} justifyContent={'space-between'}>
                <Box w={'full'} h='full'>
                    <Flex alignItems={'center'} mb={2.5}>
                        <Avatar size={'sm'} mx={2.5} />
                        <Text
                            fontWeight={'hairline'}
                            color={ACCENT_COLOR_LIGHT}>
                            Ronit Panda
                        </Text>
                    </Flex>
                    <Box w='full' mr={5}>
                        <Image
                            objectFit='cover'
                            src='https://firebasestorage.googleapis.com/v0/b/ticketing-d58e2.appspot.com/o/images%2Fselena-gomez-once-left-us-drooling-while-she-posed-nked-with-a-towel-covering-her-assets-01.jpg1c493d09-6b06-4591-a7a4-971c6b9e393b?alt=media&token=bbf25666-5365-47ca-923a-cc9a7e93f4c3'
                            alt='Dan Abramov'
                        />
                    </Box>
                    <Flex justifyContent={'space-between'} mx='2.5' my={0}>
                        <Box>
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                aria-label='like'
                                icon={<BsSuitHeart />}
                            />
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                onClick={onOpen}
                                aria-label='comment'
                                icon={<BsChatRight />}
                            />
                        </Box>
                        <Box>
                            <IconButton
                                variant={'ghost'}
                                size={'lg'}
                                aria-label='comment'
                                icon={<BsBookmarkCheck />}
                            />
                        </Box>
                    </Flex>
                    <Box mx={2.5}>
                        <Text letterSpacing={'wide'} fontWeight={'thin'}>
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Perspiciatis qui dicta, nostrum, ipsum
                            nesciunt tempore vel ipsa, rem maiores dolorem
                            consequuntur? Officia ex quae veritatis ab corrupti
                            aliquid saepe ipsum?
                        </Text>
                        <Link color={'gray.500'} fontSize='sm' mt={2.5}>
                            View all comments
                        </Link>
                        <Text color={'gray.500'} fontSize='xs' mt={2.5}>
                            17 hours ago
                        </Text>
                    </Box>
                </Box>

                <Box>
                    <CommentInputBar />
                </Box>
            </Stack>
        </Box>
    );
};

export default HomePagePost;

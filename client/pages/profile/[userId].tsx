import {
    Avatar,
    Box,
    ButtonGroup,
    Divider,
    Flex,
    Heading,
    Image,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import AccentOutlineButton from '../../components/accent-outline-buttons';
import AppBar from '../../components/app-bar';
import IndividualProfilePostPicture from '../../components/user-profile-post-pic';
import { ACCENT_COLOR } from '../../styles/consts';

const UserProfile = () => {
    return (
        <>
            <AppBar />
            <Box w={'full'}>
                <Flex
                    maxW={['100%', '75%', '60%', '50%']}
                    mx={'auto'}
                    alignItems='center'
                    my={[1, 10, 20]}>
                    <Box mr={['1.5', 10, 20]} ml={0}>
                        <Avatar
                            size={['lg', 'xl', '2xl']}
                            name='Dan Abrahmov'
                            src='https://bit.ly/dan-abramov'
                        />
                    </Box>
                    <Box>
                        <Flex
                            mb={['1', '5', '10']}
                            flexDirection={['column', 'column', 'row']}
                            justifyContent={'space-between'}
                            alignItems={['flex-start', 'center']}>
                            <Box>
                                <Heading
                                    fontWeight={'normal'}
                                    color={ACCENT_COLOR}
                                    fontFamily='serif'
                                    fontSize={['xl', '2xl', '3xl', '4xl']}>
                                    Ronit Panda
                                </Heading>
                                <Text color={'gray.400'} fontWeight='hairline'>
                                    Ronit has 100 friends and 10 posts
                                </Text>
                            </Box>
                            <ButtonGroup gap={4}>
                                <AccentOutlineButton
                                    buttonText={'Add Friend'}
                                />
                                <AccentOutlineButton buttonText={'Message'} />
                            </ButtonGroup>
                        </Flex>
                        <Text
                            flexWrap={'wrap'}
                            color='gray.400'
                            display={['none', 'block']}>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            standard dummy text ever since the 1500s, when an
                            unknown printer took a galley of type and scrambled
                            it
                        </Text>
                    </Box>
                </Flex>
                <Divider maxW={'60%'} mx='auto' />
                <SimpleGrid
                    maxW={['75%', '60%', '55%']}
                    mx={'auto'}
                    my={['0', '3', '6', '7']}
                    spacing={'16'}
                    templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                    <IndividualProfilePostPicture />

                    <IndividualProfilePostPicture />
                    <IndividualProfilePostPicture />
                    <IndividualProfilePostPicture />
                </SimpleGrid>
            </Box>
        </>
    );
};

export default UserProfile;

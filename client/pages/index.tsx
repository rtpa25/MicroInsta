import { Box, useDisclosure } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AppBar from '../components/app-bar';
import HomePagePost from '../components/home-page-post';
import FullImageDisplayModal from '../components/full-post-display-modal';

const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function renderRow(props: ListChildComponentProps) {
        const { index, style } = props;

        return (
            <Box key={index} style={style}>
                <HomePagePost onOpen={onOpen} />
            </Box>
        );
    }

    return (
        <Box h={'90vh'} mb={0}>
            <AppBar />
            <AutoSizer>
                {({ height, width }) => {
                    return (
                        <List
                            height={height}
                            width={width}
                            itemSize={750}
                            itemCount={10}
                            overscanCount={5}>
                            {renderRow}
                        </List>
                    );
                }}
            </AutoSizer>
            <FullImageDisplayModal onClose={onClose} isOpen={isOpen} />
        </Box>
    );
};

export default Home;

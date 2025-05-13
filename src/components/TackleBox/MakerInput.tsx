import { Box, HStack, Input, Spacer, Text, Image } from '@chakra-ui/react';
import searchicon from '@/assets/icon/search_icon.png';

export const MakerInput = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Box>
        <HStack>
          <Text color="white" fontWeight="bold"></Text>
          <Spacer />¥{' '}
        </HStack>
        <Box
          position="relative"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          py={5}
        >
          <Input
            bg="brand.bclBgBlue"
            _placeholder={{ opacity: 0.4, color: 'white' }}
            color="white"
            borderColor="white"
            pl="30px"
            position="relative"
            placeholder="メーカーを入力"
            zIndex="1"
            width="22rem"
          />
          <Image
            src={searchicon.src}
            alt="Search Icon"
            boxSize="20px"
            position="absolute"
            left="10px"
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
          />
        </Box>
      </Box>
    </Box>
  );
};

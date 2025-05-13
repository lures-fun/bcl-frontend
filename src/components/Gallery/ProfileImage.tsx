import { Image } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import defaultImage from 'src/assets/preview.png';

type Props = {
  coverImage?: string;
  profileImage?: string;
};

export const ProfileImage = (props: Props) => {
  return (
    <Box position="relative">
      <Image
        src={props.coverImage || defaultImage.src}
        height="40vh"
        width="100%"
        objectFit="cover"
        onError={(error) => {
          error.currentTarget.src = defaultImage.src;
          error.currentTarget.srcset = defaultImage.src;
        }}
      />
      <Box
        height="40px"
        position="absolute"
        px="6"
        roundedTop="3xl"
        bottom="0"
        width="100%"
        bg="black"
      >
        <Image
          src={props.profileImage || defaultImage.src}
          width="80px"
          height="80px"
          position="absolute"
          bottom="0"
          rounded="full"
          border="3px"
          borderStyle="solid"
          borderColor="black"
          onError={(error) => {
            error.currentTarget.src = defaultImage.src;
            error.currentTarget.srcset = defaultImage.src;
          }}
        />
      </Box>
    </Box>
  );
};

import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  title: string;
  element: ReactNode;
  onClick?: () => void;
};
export const Assortment = ({ title, element, onClick }: Props) => {
  return (
    <Flex flexDir={'column'} alignItems={'center'} onClick={() => onClick && onClick()}>
      <Box textAlign={'center'} color="white" fontWeight="extrabold" fontSize="1.2rem">
        {element}
      </Box>
      <Box fontSize="10px" textAlign={'center'}>
        {title}
      </Box>
    </Flex>
  );
};

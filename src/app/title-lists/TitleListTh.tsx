import { TableColumnHeaderProps, Th } from '@chakra-ui/react';

const TitleListTh = ({ children, ...props }: TableColumnHeaderProps) => {
  return (
    <Th
      fontSize={{ base: '2xs', md: 'sm' }}
      fontWeight="light"
      color="white"
      textAlign="center"
      px="1"
      {...props}
    >
      {children}
    </Th>
  );
};

export default TitleListTh;

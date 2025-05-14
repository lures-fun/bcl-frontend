import { TableCellProps, Td } from '@chakra-ui/react';

const TitleListTd = ({ children, ...props }: TableCellProps) => {
  return (
    <Td
      textAlign="center"
      fontWeight="semibold"
      px="1"
      fontSize={{ base: 'sm', md: 'md' }}
      {...props}
    >
      {children}
    </Td>
  );
};

export default TitleListTd;

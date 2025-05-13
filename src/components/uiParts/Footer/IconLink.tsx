import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const IconLink = ({
  href,
  isExternal = false,
  icon,
  text,
}: {
  href: string;
  isExternal?: boolean;
  icon: ReactNode;
  text: string;
}) => (
  <Link
    href={href}
    w="80px"
    h="70px"
    pt="2"
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    isExternal={isExternal}
  >
    <Flex direction="column" alignItems="center" gap={1}>
      {icon}
      <Text fontSize={8} fontWeight="bold" color="white" whiteSpace="pre" textAlign="center">
        {text}
      </Text>
    </Flex>
  </Link>
);

import { Link, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const NavLink = ({
  href,
  isExternal = false,
  children,
}: {
  href: string;
  isExternal?: boolean;
  children: ReactNode;
}) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
    isExternal={isExternal}
    color="white"
  >
    {children}
  </Link>
);

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { HEADER_MENU } from '@/utils/constValues';

export const HeaderDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const goToInquiry = useCallback(() => {
    window.open('https://forms.gle/iBnqomsnLKh3VNpV8', '_blank');
  }, []);
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="brand.fairBlack">
        <DrawerCloseButton size="lg" color="white" />
        <DrawerBody
          py={12}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          bg="brand.bclBgGlay"
        >
          <Flex as="nav" my="4" flexDirection="column">
            {HEADER_MENU.map((menu) => {
              const href = menu.link;
              return (
                <Link
                  key={menu.text}
                  href={href}
                  borderBottom="1px"
                  borderColor="brand.bclBgGlay"
                  isExternal={menu.isExternal}
                >
                  <Flex
                    h="14"
                    alignItems="center"
                    justifyContent="space-between"
                    color="bclBlue"
                    borderBottom="1px solid #484848"
                  >
                    <Flex gap={4}>
                      <Image boxSize={6} objectFit="contain" src={menu.iconSrc.src} alt="icon" />
                      <Text color="white">{menu.text}</Text>
                    </Flex>
                    <ChevronRightIcon boxSize={8} />
                  </Flex>
                </Link>
              );
            })}
          </Flex>

          <Button
            w="full"
            h="12"
            bg="inherit"
            color="white"
            border="1px"
            borderColor="brand.futureGreen"
            rounded="3xl"
            _hover={{
              opacity: '0.7',
            }}
            onClick={goToInquiry}
          >
            お問い合わせ
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

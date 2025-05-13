import { Center, Spinner } from '@chakra-ui/react';

export const ApiLoading = () => (
  <Center
    position="fixed"
    top="0"
    left="0"
    width="100vw"
    height="100vh"
    bg="rgba(0, 0, 0, 0.5)"
    zIndex="9"
  >
    <Spinner size="xl" color="white" />
  </Center>
);

export default ApiLoading;

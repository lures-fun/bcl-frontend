import { Center, Spinner, VStack, Text } from '@chakra-ui/react';

export const PageLoading = () => (
  <Center minH="100vh" w="full">
    <VStack spacing={4}>
      <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" />
      <Text fontSize="lg" fontWeight="medium" color="gray.600">
        Loading...
      </Text>
    </VStack>
  </Center>
);

export default PageLoading;
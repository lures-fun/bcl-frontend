import { Box, Divider, Flex, Heading, Img, Link, LinkBox, Text } from '@chakra-ui/react';
import { Lure } from '@/types/Lure';
import defaultLure from '@/assets/unregister_lure.svg';

type Props = {
  heading: string;
  digitalLures?: Lure[];
};

const DigitalTackleGrid = (props: Props) => {
  return (
    <Box boxShadow="base" minWidth="100%" py="24px" overflowX="auto">
      <Heading as="h6" size="md" color="white" mt="1rem" py="8px" pl="8px">
        {props.heading}
      </Heading>
      <Divider mb="2rem" />
      <Flex overflowX="auto">
        {props.digitalLures?.map((item, i) => (
          <Link
            href={
              item.id && item.reviewStatus === 'APPROVE'
                ? `/lures/${item.id}/detail`
                : `/lures/${item.id}`
            }
            style={
              item.id
                ? item.reviewStatus === 'APPROVE' || item.reviewStatus === 'REJECT'
                  ? { pointerEvents: 'auto' }
                  : { pointerEvents: 'none' }
                : { pointerEvents: 'auto' }
            }
            key={i}
            maxWidth="220px"
            margin="8px"
            isExternal={!item.id}
          >
            <LinkBox alignContent="center">
              <Box
                width="220px"
                height="250px"
                rounded="xl"
                overflow="hidden"
                borderStyle="solid"
                boxShadow="base"
                bgGradient="linear(to top, #1E1D25, black)"
                display={!item.isLost ? 'flex' : 'none'}
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Box
                  position="relative"
                  width="130px"
                  height="130px"
                  rounded="xl"
                  overflow="hidden"
                  borderStyle="solid"
                >
                  <Img
                    src={
                      item.imagePath && item.reviewStatus === 'APPROVE'
                        ? item.imagePath
                        : defaultLure.src
                    }
                    width="130px"
                    height="130px"
                  />
                  {item.reviewStatus === 'APPLY' ? (
                    <Flex
                      position="absolute"
                      top={0}
                      bottom={0}
                      left={0}
                      right={0}
                      display="flex"
                      flexGrow={1}
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      申請中
                    </Flex>
                  ) : item.reviewStatus === 'REJECT' ? (
                    <Box
                      position="absolute"
                      top={0}
                      bottom={0}
                      left={0}
                      right={0}
                      display="flex"
                      flexGrow={1}
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      color="blue"
                      textDecoration="underline"
                    >
                      <Box bgColor="whiteAlpha.700" borderRadius="md" paddingX="1" paddingY="0">
                        要再申請
                      </Box>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
                <Box
                  py="3px"
                  textAlign="center"
                  color="white"
                  fontSize="4xs"
                  fontWeight="bold"
                  mt="1rem"
                >
                  <>
                    <Text>Moasic LURE</Text>
                  </>
                </Box>
              </Box>
            </LinkBox>
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default DigitalTackleGrid;

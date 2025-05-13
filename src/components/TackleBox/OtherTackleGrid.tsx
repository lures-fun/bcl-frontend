import { Box, Divider, Flex, Heading, Img, Link, LinkBox, Text } from '@chakra-ui/react';
import { Lure } from '@/types/Lure';
import defaultLure from '@/assets/unregister_lure.svg';
import { LURE_COLOR, LURETYPES } from '@/utils/constValues';

type Props = {
  heading: string;
  headingColor?: string;
  bgColor?: string;
  bgImage?: string;
  otherTackleBox?: Lure[];
  ecLink?: string;
};

const OtherTackleGrid = (props: Props) => {
  // 同じlureTypeとlureColorを持つルアーの重複を削除する
  const filteredTackleBox = props.otherTackleBox?.filter((item, i, self) => {
    return (
      i === self.findIndex((o) => o.lureType === item.lureType && o.lureColor === item.lureColor)
    );
  });

  // lureTypeに基づいてソートする
  const compareByLureType = (a: Lure, b: Lure) => {
    const lureTypeList = (Object.values(LURETYPES) as string[]).filter(
      (type) => type === LURETYPES.COIKE
    );
    // 同じLureTypeが存在するか確認する
    const lureTypeComparison = lureTypeList.indexOf(a.lureType) - lureTypeList.indexOf(b.lureType);
    if (lureTypeComparison !== 0) {
      return lureTypeComparison;
    }
    // 同じlureTypeが存在する場合、lureColorでソートする
    return a.lureColor.localeCompare(b.lureColor);
  };

  filteredTackleBox?.sort(compareByLureType);

  return (
    <Box boxShadow="base" minWidth="100%" py="24px" overflowX="auto">
      <Heading
        as="h6"
        size="md"
        color="white"
        mt="1rem"
        py="8px"
        pl="8px"
        textColor={props.headingColor ?? 'white'}
      >
        {props.heading}
      </Heading>
      <Divider mb="2rem" />
      <Flex overflowX="auto">
        {filteredTackleBox?.map((item, i) => {
          return (
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
                  display="flex"
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
                    ) : item.isLost ? (
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
                        color="red"
                      >
                        <Box
                          bgColor="blackAlpha.500"
                          borderRadius="md"
                          textAlign="center"
                          verticalAlign="middle"
                          position="absolute"
                          paddingTop="45%"
                          paddingX="1"
                          width="100%"
                          height="100%"
                        >
                          LOST
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
                    {item.lureType === LURETYPES.COIKE &&
                      item.lureColor === LURE_COLOR.COIKE.SMOKER_BG_F && (
                        <>
                          <Text>HIDE UP</Text>
                          <Text>Coike13mm</Text>
                          <Text>（#288 スモーカーBG-F）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.COIKE &&
                      item.lureColor === LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F && (
                        <>
                          <Text>HIDE UP</Text>
                          <Text>Coike13mm</Text>
                          <Text fontSize={14}>（#289 クリアーオレンジPGG-F）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.COIKE &&
                      item.lureColor === LURE_COLOR.COIKE.SPG && (
                        <>
                          <Text>HIDE UP</Text>
                          <Text>Coike13mm</Text>
                          <Text>（#290 SPG）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.COIKE &&
                      item.lureColor === LURE_COLOR.COIKE.EDGE_SHRIMP && (
                        <>
                          <Text>HIDE UP</Text>
                          <Text>Coike13mm</Text>
                          <Text>（#291 エッジシュリンプ）</Text>
                        </>
                      )}
                  </Box>
                </Box>
              </LinkBox>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};

export default OtherTackleGrid;

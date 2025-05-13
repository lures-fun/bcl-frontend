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

const BclCollaborationTackleGrid = (props: Props) => {
  // 同じlureTypeとlureColorを持つルアーの重複を削除する
  const filteredTackleBox = props.otherTackleBox?.filter((item, i, self) => {
    return (
      i === self.findIndex((o) => o.lureType === item.lureType && o.lureColor === item.lureColor)
    );
  });

  // lureTypeに基づいてソートする
  const compareByLureType = (a: Lure, b: Lure) => {
    const lureTypeList = (Object.values(LURETYPES) as string[]).filter(
      (type) =>
        type !== LURETYPES.DRAFTWAKER && type !== LURETYPES.W3_CRANKBAIT && type !== LURETYPES.COIKE
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
                    {item.lureType === LURETYPES.LC_MTO15 &&
                      item.lureColor === LURE_COLOR.LC_MTO15.MS_MOEBI_SHAD && (
                        <>
                          <Text>ラッキークラフト</Text>
                          <Text>LC MTO1.5</Text>
                          <Text>（MSモエビシャッド）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.LC_MTO15 &&
                      item.lureColor === LURE_COLOR.LC_MTO15.MS_KOHAKU_SHAD && (
                        <>
                          <Text>ラッキークラフト</Text>
                          <Text>LC MTO1.5</Text>
                          <Text>（MSコハクシャッド）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.VOLBEAT70F &&
                      item.lureColor === LURE_COLOR.VOLBEAT70F.MOEBI_CLAW && (
                        <>
                          <Text>REVONIK</Text>
                          <Text>VOLBEAT70F</Text>
                          <Text>（モエビクロー）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.VOLBEAT70S &&
                      item.lureColor === LURE_COLOR.VOLBEAT70S.APPLE_RED_CLAW && (
                        <>
                          <Text>REVONIK</Text>
                          <Text>VOLBEAT70S</Text>
                          <Text>（アップルレッドクロー）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.DOT_SIX &&
                      item.lureColor === LURE_COLOR.DOT_SIX.KOHAKU_CLAW && (
                        <>
                          <Text>REVONIK</Text>
                          <Text>Dot SIX</Text>
                          <Text>（コハククロー）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.DOT_SIX &&
                      item.lureColor === LURE_COLOR.DOT_SIX.SAKURA_SHAD && (
                        <>
                          <Text>REVONIK</Text>
                          <Text>Dot SIX</Text>
                          <Text>（サクラシャッド）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.BOXER && (
                      <>
                        <Text>plotz</Text>
                        <Text>Boxer</Text>
                        <Text>（ビーバーレイクシャッド）</Text>
                      </>
                    )}
                    {item.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
                      item.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_SAKURA && (
                        <>
                          <Text>HMKL</Text>
                          <Text>Super Jordan 68</Text>
                          <Text>（BCL SAKURA）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.HMKL_SUPER_JORDAN_68 &&
                      item.lureColor === LURE_COLOR.SUPER_JORDAN_68.BCL_KIZAKURA && (
                        <>
                          <Text>HMKL</Text>
                          <Text>Super Jordan 68</Text>
                          <Text>（BCL KIZAKURA）</Text>
                        </>
                      )}
                    {item.lureType === LURETYPES.TAPPEI_BNSP && (
                      <>
                        <Text>GEECRACK</Text>
                        <Text>TAPPEI BNSP</Text>
                      </>
                    )}
                    {item.lureType === LURETYPES.SCREW_WAKATARO && (
                      <>
                        <Text>さとう漁業</Text>
                        <Text>スクリューワカ太郎</Text>
                      </>
                    )}
                    {item.lureType === LURETYPES.RANKAKU_80 && (
                      <>
                        <Text>さとう漁協</Text>
                        <Text>乱獲80</Text>
                      </>
                    )}
                    {item.lureType === LURETYPES.HYOUSOU_BAKA_ICHIDAI && (
                      <>
                        <Text>さとう漁協</Text>
                        <Text>表層バカ一代Z</Text>
                      </>
                    )}
                    {item.lureType === LURETYPES.BALAM_300_YUKI && <Text>BALAM300 幽鬼</Text>}
                    {item.lureType === LURETYPES.VARIANT_255_YUKI && <Text>VARIANT255 幽鬼</Text>}
                    {item.lureType === LURETYPES.N_SHAD && (
                      <>
                        <Text>ロイヤルブルー</Text>
                        <Text>N-Shad</Text>
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

export default BclCollaborationTackleGrid;

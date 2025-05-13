import { Flex } from '@chakra-ui/react';
import { BigFish, FishingCount } from '@/types/Ranking';
import { COLLABORATION_MAKER, LURETYPES } from '@/utils/constValues';
import { LureTopRank } from './LureTopRank';
type Props = {
  bigFish: Map<COLLABORATION_MAKER, BigFish[]>;
  fishingCount: Map<COLLABORATION_MAKER, FishingCount[]>;
};

export const LureTopRankList = ({ bigFish, fishingCount }: Props) => {
  return (
    <Flex flexDirection={'column'} gap={6} fontSize={'xs'} fontWeight={'bold'}>
      <LureTopRank
        brandName="W3"
        lureTypes={[LURETYPES.W3_CRANKBAIT]}
        bigFish={bigFish.get(COLLABORATION_MAKER.W3_CRANKBAIT) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.W3_CRANKBAIT) ?? []}
      />
      <LureTopRank
        brandName="ドラフトウェイカー"
        lureTypes={[LURETYPES.DRAFTWAKER]}
        bigFish={bigFish.get(COLLABORATION_MAKER.DRAFTWAKER) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.DRAFTWAKER) ?? []}
      />
      <LureTopRank
        brandName="BCL×さとう漁協"
        lureTypes={[LURETYPES.HYOUSOU_BAKA_ICHIDAI, LURETYPES.RANKAKU_80]}
        bigFish={bigFish.get(COLLABORATION_MAKER.SATO_GYOKYO) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.SATO_GYOKYO) ?? []}
      />
      <LureTopRank
        brandName="TAPPEI BNSP"
        lureTypes={[LURETYPES.TAPPEI_BNSP]}
        bigFish={bigFish.get(COLLABORATION_MAKER.TAPPEI_BNSP) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.TAPPEI_BNSP) ?? []}
      />
      <LureTopRank
        brandName="BCL×Lucky Craft"
        lureTypes={[LURETYPES.LC_MTO15]}
        bigFish={bigFish.get(COLLABORATION_MAKER.LC_MTO15) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.LC_MTO15) ?? []}
      />
      <LureTopRank
        brandName="BCL×サタン島田サロン"
        lureTypes={[LURETYPES.BALAM_300_YUKI, LURETYPES.VARIANT_255_YUKI]}
        bigFish={bigFish.get(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.SATAN_SHIMADA_SALON) ?? []}
      />
      <LureTopRank
        brandName="BCL×HMKL"
        lureTypes={[LURETYPES.HMKL_SUPER_JORDAN_68]}
        bigFish={bigFish.get(COLLABORATION_MAKER.HMKL) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.HMKL) ?? []}
      />
      <LureTopRank
        brandName="N-Shad"
        lureTypes={[LURETYPES.N_SHAD]}
        bigFish={bigFish.get(COLLABORATION_MAKER.N_SHAD) ?? []}
        fishingCount={fishingCount.get(COLLABORATION_MAKER.N_SHAD) ?? []}
      />
    </Flex>
  );
};

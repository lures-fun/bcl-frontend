import { LURETYPES } from "src/utils/constValues"

export type FishingResultDetail = {
  id: string,
  memberId: string,
  field: 'ASHINOKO',
  size: number,
  fishType: 'NORTHERN_LARGEMOUTH_BASS' | 'NORTHERN_SMALLMOUTH_BASS' | 'FLORIDA_LARGEMOUTH_BASS' | 'NORTHERN_SPOTTED_BASS',
  lure: FishingResultLure,
  rod: string,
  reel: string,
  line: string,
  freeTextLure: string,
  title: string,
  comment: string,
  imagePathForApply: string,
  imagePathForNft: string,
  caughtAt: string,
}

export type FishingResultLure = {
  id: string,
  mintId: string,
  memberId: string,
  color: string,
  serialCode: string,
  lureType: LURETYPES,
  purchasedAt: string,
  imagePath: string,
}
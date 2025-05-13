import { LURETYPES } from "src/utils/constValues"

export type Trophy = {
  id: string
  trophyId: string
  memberId: string
  contestId: string
  fishingResultId: string
  mintId: string
  imagePath: string
  title: string
  content: string
  field: string
  size: string
  fishType: string
  freeTextLure: string
  lureType: LURETYPES
  color: string
  rod: string
  reel: string
  line: string
  caughtAt: string
}
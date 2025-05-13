export type MistFishing = {
  id: string,
  memberId: string,
  userName: string,
  mintId: string,
  field: string,
  title: string,
  size: number,
  fishType: string,
  lureId: string,
  rod: string,
  line: string,
  reel: string,
  imagePathForApply: string,
  imagePathForNft: string,
  comment: string,
  caughtAt: string
}

export type LureMintFishing = {
  summary: number,
  results: MistFishing[]
}
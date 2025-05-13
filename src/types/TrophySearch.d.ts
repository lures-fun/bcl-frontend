export type TrophySearch = {
  summary: number
  results: Trophy[]
}

export type Trophy = {
  trophyId: string;
  contestId: string;
  memberId: string;
  field: string;
  color: string;
  size: number;
  userName: string;
  profileIcon: string;
  caughtAt: string;
  lureId: string;
  lureImagePath: string;
  lureType: string;
}
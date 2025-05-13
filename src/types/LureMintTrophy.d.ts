export type MintTrophy = {
  trophyId: string;
  memberId: string;
  userName: string;
  contestId: string;
  mintId: string;
  contestName: string;
  field: string;
  trophyType: string;
  trophyImagePath: string;
  willBeStartAt: string;
  willBeEndAt: string;
  trophyTitle: string;
};

export type LureMintTrophy = {
  summary: number;
  results?: MintTrophy[];
};

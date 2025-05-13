import { LURETYPES } from 'src/utils/constValues';

export type Lure = {
  id: string;
  userName;
  lureColor: string;
  serialCode: string;
  lureType: LURETYPES;
  imagePath: string;
  imagePathForApply: string;
  reviewStatus: string;
  bigfish: string;
  purchasedAt: string;
  reviewStatus: string;
  isLost: boolean;
  legendary: boolean;
};

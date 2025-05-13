export type Gallery = {
  fishingResults: FishingResult[];
  trophies: GalleryTrophy[];
  profile: Profile;
  followerCount: number;
  followeeCount: number;
  biggestFish: number;
  isFollowed: boolean;
  walletAddress: string;
};

export type FishingResult = {
  id: string;
  field: string;
  title: string;
  size: number;
  imagePathForNft: string;
};

export type GalleryTrophy = {
  trophyId: string;
  trophyTitle: string;
  contestId: string;
  contestTitle: string;
  contestContent: string;
  contestField: string;
  trophyImagePath: string;
};

export type Profile = {
  id: string;
  userName: string;
  lastName: string;
  firstName: string;
  profileIcon: string;
  profileImage: string;
  fishingCareer: number;
  mainField: string;
  mainRod: string;
  mainReel: string;
  mainLine: string;
  introduction: string;
};

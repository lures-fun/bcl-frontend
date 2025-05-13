'use client';

import { Button } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { Link, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { Profile } from '@/types/Gallery';
import { paths } from '@/utils/constValues';
import { TextWithSquare } from '../uiParts/Text/TextWithSquare';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

type Props = {
  profile: Profile;
  isFollowed: boolean;
  isMyProfile: boolean;
  memberId: string;
};

export const ProfileDetail = ({ profile, isFollowed, isMyProfile, memberId }: Props) => {
  const [isExpended, setIsExpended] = useState(false);
  const [isFollowedState, setIsFollowedState] = useState<boolean>(isFollowed);
  const { showErrorToast } = useCustomToast();
  const router = useRouter();
  const { t } = useTranslation();

  const toggleFollowUser = useCallback(
    async (memberId: string) => {
      try {
        if (!isFollowedState) {
          await axiosInstance.post('/follow', {
            followedMemberId: memberId,
          });
        } else {
          await axiosInstance.delete('/follow', {
            data: {
              followedMemberId: memberId,
            },
          });
        }
        setIsFollowedState(!isFollowedState);
      } catch (error) {
        console.log(error);
        showErrorToast('失敗しました', 'フォローに失敗しました。');
      }
    },
    [isFollowedState, showErrorToast]
  );

  const handleOnClick = useCallback(() => {
    if (!isMyProfile) {
      toggleFollowUser(memberId);
    } else router.push(paths.myPage);
  }, [isMyProfile, memberId, router, toggleFollowUser]);

  return (
    <Flex
      fontSize="md"
      direction="column"
      px={{ base: 6, lg: 8 }}
      gap="2"
      position="relative"
      mt="-0.5rem"
    >
      <TextWithSquare fontSize="14px">{t('アングラー詳細')}</TextWithSquare>
      {isExpended && (
        <>
          <Text>
            {t('釣り歴')} : {profile.fishingCareer}{' '}
            {profile.fishingCareer === 1 ? t('年') : t('years')}
          </Text>
          <Text>
            {t('メインフィールド')} : {profile.mainField}
          </Text>
          <Text>
            {t('メインロット')} : {profile.mainRod}
          </Text>
          <Text>
            {t('メインリール')} : {profile.mainReel}
          </Text>
          <Text>
            {t('メインライン')} : {profile.mainLine}
          </Text>
          <Text>
            {t('自己紹介')} : {profile.introduction}
          </Text>
        </>
      )}
      <Link
        onClick={() => setIsExpended(!isExpended)}
        textDecoration="underline"
        mt={-2}
        fontSize="12px"
      >
        {isExpended ? t('少なくする') : t('...続きを読む')}
      </Link>
      <Button
        onClick={handleOnClick}
        type="button"
        bgColor="white"
        color="black"
        rounded="md"
        position="absolute"
        top={5}
        right={{ base: 1, sm: 2, lg: 8 }}
        py={2}
        mr={4}
        height="29px"
        fontSize="0.75rem"
        minW="111px"
        width="20%"
        fontWeight="bold"
        mt={-4}
      >
        {isMyProfile ? t('マイページ編集') : isFollowedState ? t('フォロー中') : t('フォロー')}
      </Button>
    </Flex>
  );
};

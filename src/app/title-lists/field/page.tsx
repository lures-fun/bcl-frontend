'use client';

import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import {
  Avatar,
  CircularProgress,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useFetchMasterData } from '@/hooks/useFetchMasterData';
import axiosInstance from '@/lib/axiosInstance';
import { FieldMaster } from '@/types/Master';
import { TrophySearch } from '@/types/TrophySearch';
import { LURETYPES, pathsCreator } from '@/utils/constValues';
import TitleListTh from '../TitleListTh';
import TitleListTd from '../TitleListTd';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const FieldTitleList = () => {
  const { showErrorToast } = useCustomToast();
  const { masterData: fieldMaster } = useFetchMasterData<FieldMaster>('fields');
  const [trophies, setTrophies] = useState<TrophySearch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();

  const { watch, register } = useForm<{ lureType: LURETYPES }>({
    defaultValues: {
      lureType: LURETYPES.W3_CRANKBAIT,
    },
  });
  const lureType = watch('lureType');

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const response = await axiosInstance.get<TrophySearch>(
          `/trophies/search/FIELD/${lureType}`
        );
        setTrophies(response.data);
      } catch (error) {
        console.log(error);
        showErrorToast(t('読み込みに失敗しました。'), t('読み込みに失敗しました。'));
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    fetchTrophies();
  }, [lureType, showErrorToast, t]);
  const filteredResults = trophies?.results.filter((trophy) => trophy.field.includes('00'));

  return (
    <Box bg="black">
      <HeaderMenu />
      <Flex minHeight="100vh" py="3" flexDirection="column" textColor="white">
        <Box px="5" py="3">
          <SelectInput
            label={t('ルアー名')}
            name="lureType"
            maxW="200px"
            options={[
              { label: 'W3_CRANKBAIT', value: LURETYPES.W3_CRANKBAIT },
              { label: 'DRAFTWAKER', value: LURETYPES.DRAFTWAKER },
            ]}
            register={register}
          />
          <Divider pt="3" />
        </Box>
        <Text py="3" px="5" alignSelf="flex-start">
          {t('フィールドタイトル保持者一覧')}
        </Text>
        <TableContainer>
          <Table variant="unstyled">
            <Thead>
              <Tr>
                <TitleListTh>{t('フィールド')}</TitleListTh>
                <TitleListTh>{t('タイトル保持者')}</TitleListTh>
                <TitleListTh>{t('サイズ')}</TitleListTh>
                <TitleListTh>{t('ルアー')}</TitleListTh>
                <TitleListTh>{t('日時')}</TitleListTh>
              </Tr>
            </Thead>
            <Tbody>
              {!isLoading &&
                filteredResults &&
                filteredResults.map((trophy, index) => (
                  <Tr key={index}>
                    <TitleListTd>
                      {fieldMaster?.find((f) => f.id === trophy.field)?.name}
                    </TitleListTd>
                    <TitleListTd>
                      {trophy.userName ? (
                        <Flex
                          direction="column"
                          alignItems="center"
                          onClick={() => router.push(pathsCreator.gallery(trophy.userName))}
                        >
                          <Avatar src={trophy.profileIcon} size="md" name="" />
                          <Text maxW="100px" fontSize="xs" py="1" isTruncated>
                            @{trophy.userName}
                          </Text>
                        </Flex>
                      ) : (
                        <Flex direction="column" alignItems="center">
                          <Avatar src={trophy.profileIcon} size="md" name="" />
                        </Flex>
                      )}
                    </TitleListTd>
                    <TitleListTd>
                      {trophy.size ? <Text fontWeight="extrabold">{trophy.size}cm</Text> : '-'}
                    </TitleListTd>
                    <TitleListTd>{trophy.color ? <Text>#{trophy.color}</Text> : '-'}</TitleListTd>
                    <TitleListTd>
                      {trophy.caughtAt ? new Date(trophy.caughtAt).toLocaleDateString('ja') : '-'}
                    </TitleListTd>
                  </Tr>
                ))}
            </Tbody>
            {!isLoading && trophies?.summary === 0 && (
              <TableCaption textAlign="left">{t('フィールドタイトルがありません。')}</TableCaption>
            )}
            {isLoading && (
              <TableCaption mt="0">
                <CircularProgress isIndeterminate color="brand.bclBlue" size="30px" />
              </TableCaption>
            )}
          </Table>
        </TableContainer>
      </Flex>
      <Footer />
    </Box>
  );
};

export default FieldTitleList;

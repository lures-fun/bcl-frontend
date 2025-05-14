'use client';

import { Flex, Box, Heading } from '@chakra-ui/react';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { TackleGrid } from '@/components/TackleBox/TackleGrid';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Tacklebox } from '@/types/TackleBox';
import { LURETYPES } from '@/utils/constValues';
import BclCollaborationTackleGrid from '@/components/TackleBox/BclCollaborationTackleGrid';
import OtherTackleGrid from '@/components/TackleBox/OtherTackleGrid';
import { Lure } from '@/types/Lure';
import DigitalTackleGrid from '@/components/TackleBox/DigitalTackleGrid';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const TackleBox = () => {
  const [tackleBox, setTackleBox] = useState<Tacklebox>();
  const { t } = useTranslation();
  const [otherTackleBox, setOtherTackleBox] = useState<Lure[]>();
  const useParam = useParams();
  const userName = useParam.userName as string;

  useEffect(() => {
    const fetchData = () => {
      axiosInstance
        .get(`/tackle-box/${userName}`)
        .then((response) => {
          if (!response) {
            throw new Error('');
          } else {
            const originalTackle = {
              crankbaits: response.data?.crankbaits,
              draftWakers: response.data?.draftWakers,
              otherLures: response.data?.otherLures,
            };

            setTackleBox(originalTackle);
            setOtherTackleBox(response.data?.otherLures);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    if (userName) fetchData();
  }, [userName]);

  return (
    <>
      <Box bg="black">
        <HeaderMenu />
        <Flex minHeight="100vh" flexDirection="column" px="2" pt="8">
          <Heading width="100%" as="h5" size="sm" color="white" textAlign="center">
            {t('デジタルタックルボックス')}
          </Heading>
          {/* <MakerInput /> */}
          {tackleBox?.crankbaits && tackleBox?.draftWakers && (
            <TackleGrid
              heading="BCL"
              type={[LURETYPES.DRAFTWAKER, LURETYPES.W3_CRANKBAIT]}
              ecLink={[
                'https://blockchainlures.myshopify.com/collections/w3',
                'https://blockchainlures.myshopify.com/collections/draft-waker',
              ]}
              tackleBox={tackleBox}
            />
          )}
          {otherTackleBox && (
            <BclCollaborationTackleGrid
              heading={t('BCLコラボ')}
              otherTackleBox={otherTackleBox.filter(
                (lure) =>
                  lure.lureType !== LURETYPES.MOSAIC_LURE &&
                  lure.lureType !== LURETYPES.COIKE &&
                  lure.lureType !== LURETYPES.BALAM_200
              )}
              ecLink="https://blockchainlures.myshopify.com/collections/draft-waker"
            />
          )}
          {otherTackleBox && (
            <OtherTackleGrid
              heading={t('HIDE UP')}
              otherTackleBox={otherTackleBox.filter((lure) => lure.lureType === LURETYPES.COIKE)}
            />
          )}
          {otherTackleBox && (
            <OtherTackleGrid
              heading={t('MADNESS JAPAN')}
              otherTackleBox={otherTackleBox.filter(
                (lure) => lure.lureType === LURETYPES.BALAM_200
              )}
            />
          )}
          {otherTackleBox && (
            <DigitalTackleGrid
              heading={t('デジタルルアー')}
              digitalLures={otherTackleBox?.filter(
                (lure) => lure.lureType === LURETYPES.MOSAIC_LURE
              )}
            />
          )}
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default TackleBox;

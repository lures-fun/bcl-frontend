'use client';

import { Box, Divider, Flex, Heading, Img, Link, LinkBox, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DRAFTWAKER from '@/assets/DRAFT_WAKER_01.png';
import W3 from '@/assets/W3_CRANKBAIT_01.png';
import { Tacklebox } from '@/types/TackleBox';
import { LURETYPES, pathsCreator } from '@/utils/constValues';

type LureItem = {
  id: string;
  lureType: LURETYPES;
  lureColor: string;
  serialCode: string;
  imagePath: string;
  reviewStatus: string;
  isLost: boolean;
};

type Props = {
  type: LURETYPES[];
  heading: string;
  headingColor?: string;
  bgColor?: string;
  bgImage?: string;
  ecLink: string[];
  items?: LureItem[];
  tackleBox: Tacklebox;
};

export const TackleGrid = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const userName = pathname.split('/')[2] || '';

  const gotoTackleBox = useCallback(
    (mergedLure: LureItem, props: Props) => {
      const stateObject: any = {
        mergedLure: mergedLure,
        props: props,
      };
      if (mergedLure.lureType === LURETYPES.W3_CRANKBAIT) {
        stateObject.tackleBoxCrankbaits = props.tackleBox?.crankbaits.filter(
          (l) => l.reviewStatus !== 'HIDDEN'
        );
      } else {
        stateObject.tackleBoxDraftWakers = props.tackleBox?.draftWakers.filter(
          (l) => l.reviewStatus !== 'HIDDEN'
        );
      }
      // TODO: stateObjectをなんのために使っているか調査？
      const targetUrl = pathsCreator.tackleBoxList(mergedLure.lureType, userName as string);
      router.push(targetUrl);
    },
    [router, userName]
  );

  return (
    <Box boxShadow="base" minWidth="100%">
      <Heading
        as="h6"
        size="md"
        color="white"
        mt="1rem"
        py="8px"
        pl="8px"
        textColor={props.headingColor ?? 'white'}
      >
        {props.heading}
      </Heading>
      <Divider mb="2rem" />
      <Flex overflowX="auto">
        {props.type.map((type, i) => {
          const mergedLure = props.items?.find((item) => item.lureType === type) || {
            id: '',
            lureType: type,
            lureColor: '',
            serialCode: '',
            imagePath: '',
            reviewStatus: '',
            isLost: false,
          };

          return (
            <Link
              key={i}
              maxWidth="220px"
              margin="8px"
              isExternal={!mergedLure.id}
              onClick={() => gotoTackleBox(mergedLure, props)}
            >
              <LinkBox alignContent="center">
                <Box
                  width="220px"
                  height="250px"
                  rounded="xl"
                  overflow="hidden"
                  borderStyle="solid"
                  boxShadow="base"
                  bgGradient="linear(to top, #1E1D25, black)"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Box
                    width="130px"
                    height="130px"
                    rounded="xl"
                    overflow="hidden"
                    borderStyle="solid"
                    boxShadow="base"
                  >
                    {mergedLure.lureType === LURETYPES.W3_CRANKBAIT && (
                      <Img src={W3.src} width="130px" height="130px" />
                    )}
                    {mergedLure.lureType === LURETYPES.DRAFTWAKER && (
                      <Img src={DRAFTWAKER.src} width="130px" height="130px" />
                    )}
                  </Box>
                  <Box py="3px" textAlign="center" color="white" fontSize="4xs" fontWeight="bold">
                    <Text mt="1rem">{mergedLure.lureType.replace(/_/g, ' ')}</Text>
                  </Box>
                </Box>
              </LinkBox>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};

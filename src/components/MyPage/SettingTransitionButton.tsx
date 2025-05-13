import { Box, Divider, HStack, Spacer, Text } from '@chakra-ui/react';
import React, { MouseEvent } from 'react';
import { SettingChangeButton } from '../uiParts/button/SettingChangeButton';

type SettingTransitionButtonProps = {
  label: string
  btnText: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  divider?: boolean
};

export const SettingTransitionButton: React.FC<SettingTransitionButtonProps> = ({ label, btnText, onClick, divider }) => (
  <React.Fragment>
    <Box p={5} pb={0}>
      <HStack mb={5}>
        <Text color="white" fontWeight="bold">
          {label}
        </Text>
        <Spacer />
        <SettingChangeButton onClick={onClick} buttonText={btnText} />
      </HStack>
      {divider && <Divider />}
    </Box>
  </React.Fragment>
);

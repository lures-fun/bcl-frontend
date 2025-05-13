import { Button, ButtonProps } from '@chakra-ui/react';
import * as React from 'react';

type SettingChangeButtonProps = ButtonProps & {
  buttonText: string;
  isDisabled?: boolean;
  isBackgroundColorWhite?: boolean;
};

export const SettingChangeButton = ({
  buttonText,
  isDisabled,
  isBackgroundColorWhite,
  ...baseButtonProps
}: SettingChangeButtonProps) => (
  <Button
    h={8}
    px={8}
    bg={isBackgroundColorWhite ? "white" : "black" }
    color={isBackgroundColorWhite ? "black" : "white"}
    colorScheme={isBackgroundColorWhite ? "blackAlpha" : "white"}
    border="2px"
    borderColor={isBackgroundColorWhite ? "black" : "white"}
    fontSize="12"
    variant="outline"
    rounded="3xl"
    _hover={{ opacity: 0.4, color: isBackgroundColorWhite ? "black" : "white" }}
    isDisabled={isDisabled}
    {...baseButtonProps}
  >
    {buttonText}
  </Button>
);

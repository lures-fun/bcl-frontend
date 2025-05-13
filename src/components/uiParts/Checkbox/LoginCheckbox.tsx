import { Box, Flex, useCheckbox } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface LoginCheckboxProps {
  isChecked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LoginCheckbox = (props: LoginCheckboxProps) => {
  const { state, getCheckboxProps, getInputProps, htmlProps } = useCheckbox(props);

  return (
    <chakra.label
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gridColumnGap={2}
      maxW="36"
      bg="white"
      rounded="full"
      w={5}
      h={5}
      cursor="pointer"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex alignItems="center" justifyContent="center" w={4} h={4} {...getCheckboxProps()}>
        {state.isChecked && <Box w={2} h={2} rounded="full" bg="brand.inputBorderGray" />}
      </Flex>
    </chakra.label>
  );
};

export default LoginCheckbox;

import { Box, Divider, HStack, Input, Text } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

type SettingInputProps = {
  type?: string;
  label: string;
  disabled?: boolean;
  placeholder: string;
  defaultValue?: string;
  validation?: any;
  register?: UseFormRegister<any>;
  errors?: any;
  name: string;
};

export const SettingInput: React.FC<SettingInputProps> = ({
  type,
  label,
  disabled = false,
  placeholder,
  defaultValue,
  validation,
  register,
  errors,
  name,
}) => {
  const registerOptions = {
    ...validation,
    setValueAs: type === 'number' ? (value: string) => parseInt(value, 10) : undefined,
  };

  return (
    <Box p={5} pb={0}>
      <HStack>
        <Text color="white" fontWeight="bold">
          {label}
        </Text>
      </HStack>
      <Box display="flex" flexDirection="column" justifyContent="center" py={5}>
        <Input
          type={type || 'text'}
          bg="brand.bclBgBlue"
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color="white"
          borderColor="white"
          disabled={disabled}
          placeholder={placeholder ?? ''}
          defaultValue={defaultValue}
          {...(register && name ? register(name, registerOptions) : {})}
        />
        {errors?.[name] && (
          <Text fontSize="14" color="brand.inputError" mt="2">
            {errors?.[name]?.message}
          </Text>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

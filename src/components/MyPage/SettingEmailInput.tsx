import { Box, HStack, Input, Text } from '@chakra-ui/react';

type SettingEmailInputProps = {
  type?: string
  label: string
  disabled?: boolean
  placeholder: string
  defaultValue?: string
};

export const SettingEmailInput: React.FC<SettingEmailInputProps> = ({
  type,
  label,
  disabled = false,
  placeholder,
  defaultValue,
}) => {
  return (
    <Box p={5} pb={0}>
      <HStack>
        <Text color='white' fontWeight='bold'>
          {label}
        </Text>
      </HStack>
      <Box display='flex' flexDirection='column' justifyContent='center' py={5}>
        <Input
          type={type || 'text'}
          bg='brand.bclBgBlue'
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color='white'
          borderColor='white'
          disabled={disabled}
          placeholder={placeholder ?? ''}
          defaultValue={defaultValue}
        />
      </Box>
    </Box>
  )
};

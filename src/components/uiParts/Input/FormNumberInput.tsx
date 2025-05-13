import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  NumberInputProps,
  Text,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

type Props = NumberInputFieldProps & NumberInputProps & {
  label: string;
  subLabel?: string;
  name: string;
  placeholder?: string;
  error?: any;
  register: UseFormRegister<any>;
  validation?: any;
  precision?: number;
  step?: number;
  rightElement?: ReactNode;
  showLine?: boolean;
};
export const FormNumberInput = ({
  label,
  subLabel,
  name,
  placeholder,
  error,
  precision,
  step,
  register,
  validation,
  rightElement,
  showLine,
  ...rest
}: Props) => {
  const registerOptions = {
    ...validation,
    setValueAs: (value: string) => parseFloat(parseFloat(value).toFixed(precision)),
  };
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} color="white" fontWeight="bold" fontSize="sm" textAlign="left">
        {label}
        {subLabel && (
          <Text fontSize="xs" textAlign="left">
            {subLabel}
          </Text>
        )}
      </FormLabel>
      <InputGroup>
        {showLine && (
          <InputLeftElement color="black">
            <div
              style={{
                width: '1px',
                height: '25px',
                borderLeft: '1.5px solid black',
                marginRight: '20px',
              }}
            ></div>
          </InputLeftElement>
        )}
        <NumberInput
          width="full"
          precision={precision}
          step={step || 1}
          focusBorderColor={showLine ? 'white' : ''}
        >
          <NumberInputField
            id={name}
            rounded="lg"
            bg={rest.bg || 'brand.bclBgBlue'}
            color={rest.color || 'white'}
            placeholder={placeholder || ''}
            _placeholder={rest._placeholder || { opacity: 0.4, color: 'white' }}
            borderColor={error ? 'brand.inputError' : 'white'}
            {...rest}
            {...register(name, registerOptions)}
          />
          {rightElement && (
            <InputRightElement
              children={rightElement}
              color={rest.color || 'white'}
              top="0"
              fontSize="1.0em"
            />
          )}
        </NumberInput>
      </InputGroup>
      <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

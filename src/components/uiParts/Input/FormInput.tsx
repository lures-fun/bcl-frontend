import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

type Props = InputProps & {
  label?: string;
  subLabel?: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: any;
  register: UseFormRegister<any>;
  validation?: any;
  rightElement?: ReactNode;
  showLine?: boolean;
};
export const FormInput = ({
  label,
  subLabel,
  name,
  type,
  placeholder,
  error,
  register,
  validation,
  rightElement,
  showLine,
  ...rest
}: Props) => {
  const registerOptions = {
    ...validation,
    setValueAs: type === 'number' ? (value: string) => parseInt(value, 10) : undefined,
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
          <div
            style={{
              width: '1px',
              height: '25px',
              position: 'absolute',
              left: '10px',
              top: '8px',
              borderLeft: '1.5px solid black',
              marginRight: '20px',
              zIndex: 2,
            }}
          ></div>
        )}
        <Input
          id={name}
          type={type || 'text'}
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
      </InputGroup>
      <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

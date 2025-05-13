import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

type Props = TextareaProps & {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: any;
  register: UseFormRegister<any>;
  validation?: any;
  rows?: number;
};
export const FormTextArea = ({
  label,
  name,
  type,
  placeholder,
  error,
  register,
  validation,
  rows,
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
      </FormLabel>
      <InputGroup>
        <Textarea
          id={name}
          bg={rest.bg || 'brand.bclBgBlue'}
          rounded="lg"
          placeholder={placeholder || ''}
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color={rest.color || 'white'}
          whiteSpace="pre-line"
          borderColor={error ? 'brand.inputError' : 'white'}
          resize="none"
          rows={rows || 10}
          {...rest}
          {...register(name, registerOptions)}
        />
      </InputGroup>
      <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
    </FormControl>
  );
};

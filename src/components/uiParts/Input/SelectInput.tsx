import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SelectProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

type SelectInputProps = SelectProps & {
  label: string;
  name: string;
  options: {
    label: string | number;
    value: string | number;
  }[];
  type?: string;
  placeholder?: string;
  error?: any;
  register: UseFormRegister<any>;
  validation?: any;
  rightElement?: ReactNode;
  showError?: boolean;
  showLine?: boolean;
};

export const SelectInput = ({
  label,
  name,
  type,
  placeholder,
  error,
  register,
  validation,
  rightElement,
  options,
  showError = true,
  showLine,
  ...rest
}: SelectInputProps) => {
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
        <Select
          id={name}
          rounded="lg"
          bg="brand.bclBgBlue"
          placeholder={placeholder || ''}
          _placeholder={{ opacity: 0.4, color: 'white' }}
          color="white"
          borderColor={error ? 'brand.inputError' : 'white'}
          sx={{
            '> option': {
              background: 'brand.bclBgBlue',
              color: 'white',
            },
          }}
          {...rest}
          {...register(name, registerOptions)}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {rightElement && (
          <InputRightElement children={rightElement} color="white" top="15%" fontSize="1.0em" />
        )}
      </InputGroup>
      {showError && (
        <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

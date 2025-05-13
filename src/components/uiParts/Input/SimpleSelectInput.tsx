import { Select, SelectProps, SystemStyleObject } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';

type SelectInputProps = SelectProps & {
  name: string;
  options: {
    label: string | number;
    value: string | number;
  }[];
  type?: string;
  placeholder?: string;
  notSelectablePlaceHolder?: string;
  error?: any;
  register: UseFormRegister<any>;
  validation?: any;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
  appearance?: string;
};

export const SimpleSelectInput = ({
  name,
  type,
  placeholder,
  error,
  register,
  validation,
  options,
  appearance,
  notSelectablePlaceHolder,
  ...rest
}: SelectInputProps) => {
  const registerOptions = {
    ...validation,
    setValueAs: type === 'number' ? (value: string) => parseInt(value, 10) : undefined,
  };
  const selectStyles: SystemStyleObject = {
    '> option': {
      background: 'black',
      color: 'white',
    },
    appearance: appearance ?? 'none', // undefined を避けるために nullish coalescing を使用
    WebkitAppearance: appearance ?? 'none', // Chrome や Safari 用
    MozAppearance: appearance ?? 'none', // Firefox 用
    paddingRight: '6px',
  };
  return (
    <Select
      id={name}
      rounded="md"
      bg="black"
      placeholder={placeholder || ''}
      _placeholder={{ opacity: 0.4, color: 'white' }}
      color="white"
      borderColor={error ? 'brand.inputError' : 'white'}
      fontSize={'9'}
      sx={selectStyles}
      icon={<div />}
      style={{ textAlignLast: 'end' }}
      defaultValue={notSelectablePlaceHolder || ''}
      {...rest}
      {...register(name, registerOptions)}
    >
      {notSelectablePlaceHolder && (
        <option value={notSelectablePlaceHolder} disabled style={{ display: 'none' }}>
          {notSelectablePlaceHolder}
        </option>
      )}
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

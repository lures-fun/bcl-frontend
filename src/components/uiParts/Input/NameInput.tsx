import { FormControl, FormLabel, Input, InputGroup, InputProps, SimpleGrid, Text } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';

type FieldsProps = {
  firstName: string
  lastName: string
}

type NameInputProps = InputProps & {
  label: string;
  names: FieldsProps;
  placeholders?: FieldsProps;
  defaultValues?: FieldsProps;
  errors?: any;
  validation?: any;
  register: UseFormRegister<any>;
};

export const NameInput: React.FC<NameInputProps> = ({
  label,
  names,
  placeholders,
  errors,
  defaultValues,
  validation,
  register,
  ...rest
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor={names.lastName} color="white" fontWeight='bold' fontSize='sm' textAlign='left'>
        {label}
      </FormLabel>
      <InputGroup>
        <SimpleGrid columns={2} spacingX={3} flexGrow={1}>
          <Input
            id={names.lastName}
            type='text'
            bg={rest.bg || 'brand.bclBgBlue'}
            color={rest.color || "white"}
            placeholder={placeholders?.lastName}
            _placeholder={rest._placeholder || { opacity: 0.4, color: 'white' }}
            defaultValue={defaultValues?.lastName}
            {...register(names.lastName, validation)}
            {...rest}
          />
          <Input
            id={names.firstName}
            type='text'
            bg={rest.bg || 'brand.bclBgBlue'}
            color={rest.color || "white"}
            placeholder={placeholders?.firstName}
            _placeholder={rest._placeholder || { opacity: 0.4, color: 'white' }}
            defaultValue={defaultValues?.firstName}
            {...register(names.firstName, validation)}
            {...rest}
          />
        </SimpleGrid>
      </InputGroup>
      {
        errors &&
        <Text fontSize='14' color='brand.inputError' flexGrow={1}>
          {errors.message}
        </Text>
      }
    </FormControl>
  )
};

import {
  Avatar,
  Box,
  ChakraComponent,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  TextareaProps,
  chakra,
} from '@chakra-ui/react';
import { forwardRef } from 'react';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form';
import { Mention, MentionsInput, MentionsInputClass } from 'react-mentions';

const ChakraMentionInput = chakra(MentionsInput);

type Props = ControllerRenderProps &
  ControllerFieldState &
  TextareaProps & {
    label?: string;
    name: string;
    color?: string;
    placeholder?: string;
    error?: any;
    validation?: any;
    rows?: number;
    value?: string;
    mentionBgColor?: string;
    fetchData: (search: string, cb: (data: any) => void) => void;
  };

export const FormMention = forwardRef<ChakraComponent<MentionsInputClass, {}>, Props>(
  ({ label, name, placeholder, error,  rows, fetchData, mentionBgColor, ...rest }, ref) => {
    return (
      <FormControl isInvalid={!!error} >
        {label && (
          <FormLabel htmlFor={name} color="white" fontWeight="bold" fontSize="sm" textAlign="left">
            {label}
          </FormLabel>
        )}
        <InputGroup zIndex='1'>
          <ChakraMentionInput
            {...rest}
            rounded="lg"
            w="full"
            minH="36"
            wordBreak="break-word"
            autoFocus={rest.autoFocus}
            _placeholder={{ opacity: 0.4, color: 'white' }}
            whiteSpace="pre-line"
            border="1px solid"
            borderColor={error ? 'brand.inputError' : 'white'}
            id={name}
            resize="none"
            sx={{
              '& textarea': {
                p: rest.padding ?? "2",
              },
            }}
            inputRef={ref}
            bg={rest.bg || 'brand.bclBgBlue'}
            placeholder={placeholder || ''}
            color={rest.color || 'white'}
            p={rest.padding ?? "2"}
            rows={rows || 10}
            value={rest.value || ''}
            customSuggestionsContainer={(children) => (
              <Box maxH="60" overflow='scroll' position='absolute' borderRadius='md' bg='white' boxShadow='dark-lg'>
                {children}
              </Box>
            )}
          >
            <Mention
              trigger="@"
              data={(search, cb) => fetchData(search, cb)}
              displayTransform={(_, text) => `@${text}`}
              appendSpaceOnAdd
              style={{
                backgroundColor: mentionBgColor ?? undefined,
              }}
              markup={'@[__display__]'}
              renderSuggestion={(suggestion: any, _search, highlightedDisplay, _index, focused) => (
                <Box bg={focused ? 'brand.bclBlue' : 'white'} color={focused ? 'white' : 'black'} p='1' pr='3' display='flex' wordBreak="initial" gap='2'>
                  <Avatar
                    src={suggestion.icon ?? ''}
                    rounded="full"
                    border="3px"
                    size='xs'
                    name={suggestion.display}
                    alignSelf="center"
                  />
                  {highlightedDisplay}
                </Box>
              )}
            />
          </ChakraMentionInput>
        </InputGroup>
        <FormErrorMessage color="brand.inputError">{error && error.message}</FormErrorMessage>
      </FormControl>
    );
  }
);

// forwardRefでラップしたコンポーネントにdisplayNameを設定する（警告対策）
FormMention.displayName = 'FormMention';

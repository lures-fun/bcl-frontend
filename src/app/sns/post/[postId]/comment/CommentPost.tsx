import { Box, Button, Flex } from '@chakra-ui/react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Footer } from '@/components/uiParts/Footer/Footer';
import { HeaderMenu } from '@/components/uiParts/Header/HeaderMenu';
import { FormInput } from '@/components/uiParts/Input/FormInput';
import dao_bg from '@/assets/DAOTalkBG.png';
import { useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { FormMention } from '@/components/uiParts/Input/FormMention';
import { Mention } from '@/types/Mention';
import { useTranslation } from 'react-i18next';

export type TokenFormFields = {
  token: number;
  comment: string;
};

type Props = UseFormReturn<TokenFormFields> & {
  onSubmit: (data: TokenFormFields) => void;
};
const CommentPost = ({ onSubmit, ...formProps }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    control,
  } = formProps;
  const { t } = useTranslation();

  const fetchMentionList = useCallback(async (search: string, cb: (data: any) => void) => {
    try {
      const mentionResponse = await axiosInstance.post<Mention[]>(
        `/follow/union-search`,
        {
          searchText: search,
          limit: 100,
        },
        {
          headers: {
            Accept: '*/*',
          },
        }
      );
      const mentionList = mentionResponse.data.map((item: Mention) => ({
        id: item.id,
        display: item.userName,
        icon: item.profileIcon,
      }));
      cb(mentionList);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box
      bg="black"
      bgImage={dao_bg.src}
      backgroundAttachment="fixed"
      backgroundSize="cover"
      backgroundPosition="center"
      bgRepeat="no-repeat"
    >
      <HeaderMenu />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          minHeight="100vh"
          maxW="450px"
          mx="auto"
          flexDirection="column"
          textColor="white"
          py="5"
          px="5"
          gap="10"
        >
          <FormInput
            label={t('送付トークン数')}
            name="token"
            type="number"
            register={register}
            value={0}
            isReadOnly={true}
            _readOnly={{ borderColor: 'gray.300', opacity: '0.4', cursor: 'not-allowed' }}
          />
          <Controller
            name="comment"
            control={control}
            render={({ field, fieldState }) => (
              <FormMention
                {...field}
                {...fieldState}
                label={t('コメント')}
                placeholder={t('コメント')}
                autoFocus
                fetchData={fetchMentionList}
              />
            )}
            rules={{
              required: t('コメントは必須です。'),
              maxLength: { value: 2000, message: t('commentは最大2000文字です') },
            }}
          />
          {/* <Flex gap={10} fontWeight='extrabold' textAlign='center' alignItems='center' justifyContent='space-evenly' textColor='white'>
            <Text>保有トークン</Text>
            <Text fontSize='xl'>1250</Text>
          </Flex> */}
          <Button
            isDisabled={isSubmitting}
            type="submit"
            rounded="3xl"
            width="100%"
            color="white"
            bgColor="brand.bclBlue"
          >
            {t('コメント')}
          </Button>
        </Flex>
      </form>
      <Footer />
    </Box>
  );
};

export default CommentPost;

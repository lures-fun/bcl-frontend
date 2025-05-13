import { useCallback, useEffect } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import axiosInstance from '@/lib/axiosInstance';
import { TokenFormFields } from '@/app/sns/post/[postId]/comment/CommentPost';
import { FormInput } from '../uiParts/Input/FormInput';
import { FormMention } from '../uiParts/Input/FormMention';
import sendIcon from '@/assets/icon/sendIcon.svg';
import { useCustomToast } from '@/hooks/useCustomToast';
import { COMMENT_TYPE } from '@/utils/constValues';
import { Comment } from '@/types/Comment';
import { Mention } from '@/types/Mention';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  threadId?: string;
  replyTo?: Comment;
};

const ReplyModal = ({ isOpen, onClose, postId, threadId, replyTo }: Props) => {
  const useFormProps = useForm<TokenFormFields>();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    control,
    reset,
  } = useFormProps;
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { t } = useTranslation();

  useEffect(() => {
    reset({ comment: `@[${replyTo?.userName}] ` });
  }, [replyTo, reset]);

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

  const onSubmit = useCallback(
    async (data: TokenFormFields) => {
      const plainTextValue = data.comment.replace(/@\[(.*?)\]/g, '@$1');
      try {
        const response = await axiosInstance.post(`/comments/${postId}/thread/${threadId}`, {
          ...data,
          comment: plainTextValue,
          type: COMMENT_TYPE.POST,
          tokenQuantity: data.token,
        });
        if (response.status === 204) {
          showSuccessToast('コメントを送信しました。', 'コメントを送信しました。');
          useFormProps.reset();
        }
      } catch (e: any) {
        console.log(e.response);
        showErrorToast('失敗しました。', 'コメントの送信に失敗しました');
      }
      onClose();
    },
    [postId, threadId, showErrorToast, showSuccessToast, useFormProps, onClose]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      orientation="vertical"
      isCentered
      autoFocus={false}
    >
      <ModalOverlay />
      <ModalContent marginBottom="0">
        <ModalHeader
          fontSize="xs"
          borderBottom={1}
          borderStyle="solid"
          borderColor="gray.200"
          p="1"
          px="2"
          color="gray.500"
        >
          {replyTo?.userName}
          {t('に返信しています')}
        </ModalHeader>
        <ModalBody px="3" py="0.5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              // label="送付トークン数"
              name="token"
              type="number"
              register={register}
              value={0}
              isReadOnly={true}
              _readOnly={{ borderColor: 'gray.300', opacity: '0.4', cursor: 'not-allowed' }}
              display="none"
            />
            <HStack justifyContent="center" alignItems="flex-start" pb={2}>
              <Controller
                name="comment"
                control={control}
                render={({ field, fieldState }) => (
                  <FormMention
                    {...field}
                    {...fieldState}
                    autoFocus={false}
                    fetchData={fetchMentionList}
                    bg="white"
                    color="black"
                    padding="0"
                    mentionBgColor="white"
                  />
                )}
                rules={{
                  required: 'コメントは必須です。',
                  maxLength: { value: 2000, message: 'commentは最大2000文字です' },
                }}
              />
              <Box
                px={2}
                bgColor="blue.500"
                rounded="full"
                _hover={{
                  bgColor: 'blue.600',
                }}
              >
                <IconButton
                  isDisabled={isSubmitting}
                  type="submit"
                  size="sm"
                  bg="transparent"
                  _hover={{
                    bg: 'transparent',
                  }}
                  rounded="full"
                  p="7px"
                  icon={<Image objectFit="contain" src={sendIcon.src} alt="send_icon" />}
                  aria-label="send_icon"
                />
              </Box>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReplyModal;

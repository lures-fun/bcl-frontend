'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useCustomToast } from '@/hooks/useCustomToast';
import axiosInstance from '@/lib/axiosInstance';
import { COMMENT_TYPE, pathsCreator } from '@/utils/constValues';
import CommentPost from './CommentPost';
import { TokenFormFields } from './CommentPost';
import { useParams, useRouter } from 'next/navigation';

const SnsPostComment = () => {
  const useFormProps = useForm<TokenFormFields>();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { postId } = useParams();
  const router = useRouter();

  const onSubmit = useCallback(
    async (data: TokenFormFields) => {
      const plainTextValue = data.comment.replace(/@\[(.*?)\]/g, '@$1');

      try {
        const response = await axiosInstance.post(`/comments/${postId}`, {
          ...data,
          comment: plainTextValue,
          type: COMMENT_TYPE.POST,
          tokenQuantity: data.token,
        });
        if (response.status === 204) {
          showSuccessToast('コメントを送信しました。', 'コメントを送信しました。');
          useFormProps.reset();
          router.push(pathsCreator.timeline());
        }
      } catch (e: any) {
        console.log(e.response);
        showErrorToast('失敗しました。', 'コメントの送信に失敗しました');
      }
    },
    [postId, router, showErrorToast, showSuccessToast, useFormProps]
  );

  return <CommentPost {...useFormProps} onSubmit={onSubmit} />;
};

export default SnsPostComment;

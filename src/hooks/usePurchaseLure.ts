import { useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axiosInstance';
import { useCustomToast } from './useCustomToast';
import { LURETYPES, pathsCreator } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

export type LurePurchaseField = {
  lureType: LURETYPES;
  color: string;
  image?: string;
  purchasedAt?: string;
};

export const usePurchaseLure = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useCustomToast();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const isLogin = pathname === '/';

  const lurePurchase = useCallback(
    async (data: LurePurchaseField) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post(`/lures/purchase`, {
          lureType: data.lureType,
          color: data.color,
          image: data.image,
        });
        showSuccessToast(t('成功'), t('ルアー登録成功'));
        setIsLoading(false);
        router.push(pathsCreator.lureDetail(response.data));
      } catch (e: any) {
        console.log(e.response);
        if (e.response.data.error === 'Conflict') {
          showErrorToast(t('重複した'), t('このカラーの同じルアーはすでに登録されています。'));
        } else {
          showErrorToast(t('失敗しました'), t('ルアー登録に失敗しました。'));
        }
        setIsLoading(false);
        if (isLogin) {
          router.push('/home');
        }
      }
    },
    [showSuccessToast, showErrorToast, router, isLogin, t]
  );

  return { isLoading, lurePurchase };
};

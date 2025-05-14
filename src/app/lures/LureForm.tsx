'use client';

import { Button, Flex } from '@chakra-ui/react';
import { UseFormReturn } from 'react-hook-form';
import { FormImage } from '@/components/uiParts/Input/FormImage';
import { FormInput } from '@/components/uiParts/Input/FormInput';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';
import { lureSerialCodeValidationRule } from '@/lib/validationRules';
import { LURE_COLOR, LURETYPES, SERIALCODES } from '@/utils/constValues';
import { useTranslation } from 'react-i18next';

export type LureFormFields = {
  lureType: string;
  serialCode: string;
  image?: string;
  purchasedAt?: string;
};

type LureFormProp = UseFormReturn<LureFormFields> & {
  mode: 'create' | 'edit';
  onSubmit: (data: LureFormFields) => Promise<void>;
};

const LureForm = ({
  mode,
  onSubmit,
  handleSubmit,
  register,
  setValue,
  watch,
  formState: { errors, isSubmitting, isDirty },
}: LureFormProp) => {
  const image = watch('image');
  const lureType = watch('lureType');
  const { t } = useTranslation();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (data.lureType === LURETYPES.TAPPEI_BNSP || data.lureType === LURETYPES.N_SHAD) {
          data.serialCode = `${LURE_COLOR.NOTHING}/${SERIALCODES.NOTHING}`;
        } else if (data.lureType.startsWith(LURETYPES.COIKE)) {
          // COIKEの場合は、lureTypeをCOIKEに変更し、serialCodeを{カラー/000}で設定
          const lureColor = data.lureType.split('_')[1];
          data.lureType = LURETYPES.COIKE;
          data.serialCode = `${lureColor}/${SERIALCODES.NOTHING}`;
        }
        onSubmit(data);
      })}
    >
      <Flex flexGrow={1} flexDirection="column" mb={10} py="12" px="4" gap="8">
        <FormImage
          onChange={async (file) => file && setValue('image', file, { shouldDirty: true })}
          label={t('購入ルアー写真アップロード')}
          subLabel={t('※シリアル番号が記載されている箱や紙を撮影してください。')}
          error={errors.image}
          fileSize={5 * 1024 * 1024}
          register={register}
          validation={{ required: t('購入ルアー写真アップロードは必須です') }}
          name="image"
          defaultImage={image}
          isRegisterLure={true}
          isImageOnly={true}
        />
        <SelectInput
          label={t('ルアー')}
          name="lureType"
          placeholder={t('- 選択')}
          options={[
            { value: 'W3_CRANKBAIT', label: 'W3 CRANKBAIT' },
            { value: 'DRAFT_WAKER', label: 'DRAFT WAKER' },
            {
              value: `LC_MTO15`,
              label: 'LC MTO1.5',
            },
            { value: 'VOLBEAT70F', label: 'VOLBEAT70F' },
            { value: 'VOLBEAT70S', label: 'VOLBEAT70S' },
            {
              value: `DOT_SIX`,
              label: 'Dot SIX',
            },
            { value: 'BOXER', label: 'Boxer' },
            {
              value: `HMKL_SUPER_JORDAN_68`,
              label: 'Super Jordan 68',
            },
            { value: 'TAPPEI_BNSP', label: 'TAPPEI BNSP' },
            { value: 'SCREW_WAKATARO', label: 'スクリューワカ太郎' },
            { value: 'RANKAKU_80', label: '乱獲80' },
            { value: 'HYOUSOU_BAKA_ICHIDAI', label: '表層バカ一代Z' },
            { value: 'N_SHAD', label: 'N-Shad' },
            { value: 'BALAM_200', label: 'BALAM200 オンドリャーチャート' },
            { value: 'BALAM_300_YUKI', label: 'BALAM300 幽鬼' },
            { value: 'VARIANT_255_YUKI', label: 'VARIANT255 幽鬼' },
            // ドロップダウンリストのValueの値を重複させると警告が出るため、（COIKE_カラー名）で識別している
            {
              value: `COIKE_${LURE_COLOR.COIKE.SMOKER_BG_F}`,
              label: '#288 Coike13mm（スモーカーBG-F）',
            },
            {
              value: `COIKE_${LURE_COLOR.COIKE.CLEAR_ORANGE_PGG_F}`,
              label: '#289 Coike13mm（クリアーオレンジPGG-F）',
            },
            { value: `COIKE_${LURE_COLOR.COIKE.SPG}`, label: '#290 Coike13mm（SPG）' },
            {
              value: `COIKE_${LURE_COLOR.COIKE.EDGE_SHRIMP}`,
              label: '#291 Coike13mm（エッジシュリンプ）',
            },
          ]}
          register={register}
          error={errors.lureType}
          validation={{ required: t('ルアーは必須です') }}
        />
        {/* 条件に記載されているルアータイプでは、シリアルコードの入力は不要。 */}
        {lureType !== LURETYPES.TAPPEI_BNSP &&
          lureType !== LURETYPES.N_SHAD &&
          !lureType?.startsWith(`${LURETYPES.COIKE}`) && (
            <FormInput
              name="serialCode"
              label={t('シリアルコード')}
              subLabel={t('※2番目と3番目の数字の間にスラッシュ (/) を入力してください。例)01/001')}
              register={register}
              error={errors.serialCode}
              validation={lureSerialCodeValidationRule}
            />
          )}
        <Button
          isDisabled={isSubmitting || !isDirty}
          type="submit"
          my="10"
          color="white"
          rounded="3xl"
          width="100%"
          bgColor="brand.bclBlue"
        >
          {mode === 'create' ? t('登録') : t('再申請')}
        </Button>
      </Flex>
    </form>
  );
};

export default LureForm;

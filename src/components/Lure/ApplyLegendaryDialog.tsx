import { Button, useDisclosure } from '@chakra-ui/react';
import { ConfirmDialog } from '../uiParts/Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';

type Props = {
  handleClick: () => Promise<void>;
};

export const ApplyLegendaryDialog = ({ handleClick }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <>
      <Button
        width="full"
        fontSize="xs"
        height="6"
        backgroundColor="gray"
        color="white"
        onClick={onOpen}
      >
        {t('殿堂入り申請')}
      </Button>

      <ConfirmDialog
        title={t('本当に殿堂入り登録しますか？')}
        body={t('殿堂入り登録したルアーは、釣果申請を行うことができなくなります。')}
        onClose={onClose}
        isOpen={isOpen}
        handleClick={async () => {
          handleClick();
        }}
      />
    </>
  );
};

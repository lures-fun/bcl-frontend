import { Button, useDisclosure } from '@chakra-ui/react';
import { ConfirmDialog } from '../uiParts/Dialog/ConfirmDialog';
import { useTranslation } from 'react-i18next';

type Props = {
  handleClick: () => Promise<void>;
};

export const LureLostDialog = ({ handleClick }: Props) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
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
        {t('ロスト申請')}
      </Button>

      <ConfirmDialog
        title={t('本当にロスト申請しますか？')}
        body={t('ロスト申請したルアーは、釣果申請を行うことができなくなります。')}
        onClose={onClose}
        isOpen={isOpen}
        handleClick={async () => {
          handleClick();
        }}
      />
    </>
  );
};

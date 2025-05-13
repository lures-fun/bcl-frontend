import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { REPORT_TYPES } from '@/utils/constValues';
import { SelectInput } from '@/components/uiParts/Input/SelectInput';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  handleClick: (reportType: string) => void;
};

export const ReportDialog = ({ onClose, isOpen, handleClick }: Props) => {
  const { t } = useTranslation();
  const { watch, register } = useForm<{ reportType: string }>({});
  const reportType = watch('reportType');
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('この投稿を報告する理由')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SelectInput
              label={t('報告')}
              name="reportType"
              register={register}
              placeholder={t('-選択')}
              options={REPORT_TYPES.map((p) => ({ label: p.name, value: p.value }))}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={async () => handleClick(reportType)}>
              OK
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

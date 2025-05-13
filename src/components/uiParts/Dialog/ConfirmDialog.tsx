import { 
    Button,
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay 
} from "@chakra-ui/react"

type Props = {
    title: string;
    body: string;
    onClose: () => void; 
    isOpen: boolean;
    handleClick: () => void;
}

export const ConfirmDialog = ({title, body, onClose, isOpen, handleClick}: Props) => {
    return (
        <>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>{body}</ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => handleClick()}>
                            OK
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
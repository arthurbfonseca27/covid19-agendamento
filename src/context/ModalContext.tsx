import React, { createContext, useState, ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface ModalProps {
  title: string;
  description: string;
  confirmText?: string;
  onClickConfirm?: () => void;
  autoHide?: boolean;
  icon?: ReactNode;
}

interface ContextProps {
  showModal: (modalProps: ModalProps) => void;
  hideModal: () => void;
}

const defaultValue: ContextProps = {
  showModal: () => {
    throw new Error("showModal must be defined.");
  },
  hideModal: () => {
    throw new Error("hideModal must be defined.");
  },
};

const ModalContext = createContext(defaultValue);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const defaultModalProps: ModalProps = {
    title: "Title",
    description: "Your description here",
    confirmText: "Ok",
    onClickConfirm: () => null,
    autoHide: true,
  };

  const [show, setShow] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps);

  const { title, description, confirmText, onClickConfirm, autoHide, icon } =
    modalProps;

  const showModal = (props: ModalProps) => {
    setModalProps({ ...defaultModalProps, ...props });
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const onClickConfirmHandler = () => {
    onClickConfirm && onClickConfirm();
    if (autoHide) {
      hideModal();
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal isOpen={show} onClose={hideModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="w-full justify-center flex items-center flex-col gap-4 text-xl">
              {icon}
              {title}
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-[#54595E] justify-center items-center flex text-center">
              <p className="text-base">{description}</p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="primary" onClick={onClickConfirmHandler}>
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

export default ModalContext;

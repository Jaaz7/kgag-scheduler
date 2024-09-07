"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Modal } from "antd";

interface ModalConfig {
  title: string;
  content: ReactNode;
  onOk: () => void;
  okText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  isModalVisible: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 900);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setModalConfig(null);
  };

  return (
    <ModalContext.Provider value={{ isModalVisible, showModal, hideModal }}>
      {children}
      {modalConfig && (
        <Modal
          title={modalConfig.title}
          centered={isMobile}
          open={isModalVisible}
          onOk={() => {
            if (modalConfig.onOk) modalConfig.onOk();
            hideModal();
          }}
          onCancel={hideModal}
          okText={modalConfig.okText || "OK"}
          cancelText={modalConfig.cancelText || "Cancel"}
        >
          {modalConfig.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

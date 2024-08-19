"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
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

// Create Modal Context with default values
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider Component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

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

// Custom Hook to Use Modal Context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

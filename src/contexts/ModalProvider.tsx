"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if the user is on a mobile device based on window width
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
  };

  useEffect(() => {
    // Set initial value
    handleResize();

    // Update value on window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
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
          centered={isMobile} // Apply centered prop only on mobile
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

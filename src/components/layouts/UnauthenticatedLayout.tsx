import React from "react";
import { Spin } from "antd";
import "@/styles/globals.css";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode | null;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({
  children,
}) => {
  if (children === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default UnauthenticatedLayout;

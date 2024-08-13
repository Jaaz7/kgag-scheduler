import React, { Suspense } from "react";
import { Spin } from "antd";
import "@/styles/globals.css";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode | null;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
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
      }
    >
      {children}
    </Suspense>
  );
};

export default UnauthenticatedLayout;

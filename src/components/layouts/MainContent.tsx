import { Spin } from "antd";
import React, { ReactNode, useEffect, useState } from "react";

interface MainContentProps {
  children: ReactNode;
  mode: string;
}

export const MainContent: React.FC<MainContentProps> = ({ children, mode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
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
  return (
    <div
      style={{
        flexGrow: 1,
        padding: "12px",
        overflowY: "auto",
        backgroundColor: mode === "dark" ? "#141414" : "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
};

import { Spin } from "antd";
import React, { ReactNode, useEffect, useState } from "react";

interface MainContentProps {
  children: ReactNode;
  mode: string;
}

const isMobile = () => window.innerWidth <= 900;

export const MainContent: React.FC<MainContentProps> = ({ children, mode }) => {
  const [loading, setLoading] = useState(true);
  const [paddingValue, setPaddingValue] = useState(isMobile() ? "0px" : "12px");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPaddingValue(isMobile() ? "0px" : "12px");
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
        padding: paddingValue,
        backgroundColor: mode === "dark" ? "#141414" : "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
};

import React, { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  mode: string;
}

export const MainContent: React.FC<MainContentProps> = ({ children, mode }) => {
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

import CurrentUser from "./CurrentUser";
import { Layout, Space } from "antd";
import ThemeSwitcher from "@components/common/ThemeSwitcher";
import { useContext } from "react";
import { ColorModeContext } from "@contexts/ColorModeContext";

export const Header = () => {
  const { mode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    top: 0,
    backgroundColor: mode === "dark" ? "#2a2a2a" : "#fff",
    zIndex: 999,
    position: "sticky",
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <ThemeSwitcher />
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

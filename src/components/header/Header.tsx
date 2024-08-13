import CurrentUser from "./CurrentUser";
import { Layout, Space } from "antd";

export const Header = () => {
  const headerStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0 24px",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 999,
    position: "sticky",
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};

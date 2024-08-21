import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Grid,
  theme,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { useTranslate, useLogout, useLink } from "@refinedev/core";

import { drawerButtonStyles } from "./styles";
import type { RefineThemedLayoutV2SiderProps } from "./types";
import { ThemedTitleV2 } from "./ThemedTitle";
import { useThemedLayoutContext } from "./UseThemeLayoutContext";
import { useModal } from "@/contexts/ModalProvider";
import { ColorModeContext } from "@/contexts/ColorModeContext";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  fixed,
}) => {
  const { token } = theme.useToken();
  const {
    siderCollapsed,
    setSiderCollapsed,
    mobileSiderOpen,
    setMobileSiderOpen,
  } = useThemedLayoutContext();

  const [currentPath, setCurrentPath] = useState("");
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (!mobileSiderOpen && isLogoutModalVisible) {
      setIsLogoutModalVisible(true);
    }
  }, [mobileSiderOpen]);

  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);

    if (typeof window !== "undefined") {
      updatePath();
      window.addEventListener("popstate", updatePath);

      const handleHistoryChange = () => setTimeout(updatePath, 0);

      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function (...args) {
        originalPushState.apply(window.history, args);
        handleHistoryChange();
      };

      window.history.replaceState = function (...args) {
        originalReplaceState.apply(window.history, args);
        handleHistoryChange();
      };

      return () => {
        window.removeEventListener("popstate", updatePath);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    }
  }, []);

  const direction = useContext(ConfigProvider.ConfigContext)?.direction;
  const translate = useTranslate();
  const Link = useLink();
  const { mutate: mutateLogout } = useLogout();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = !breakpoint.lg;
  const RenderToTitle = TitleFromProps ?? ThemedTitleV2;
  const { showModal } = useModal();
  const { mode } = useContext(ColorModeContext);

  const handleLogoutClick = () => {
    setMobileSiderOpen(false);
    showModal({
      title: "Confirm Logout",
      content: <p>Are you sure you want to logout?</p>,
      onOk: confirmLogout,
      okText: "Logout",
      cancelText: "Cancel",
    });
  };

  const confirmLogout = () => {
    mutateLogout();
  };

  const handleTitleClick = () => {
    if (isMobile) {
      setMobileSiderOpen(false);
    } else {
      setSiderCollapsed(!siderCollapsed);
    }
  };

  const renderClosingIcons = () => {
    const iconProps = { style: { color: token.colorPrimary } };
    const OpenIcon = direction === "rtl" ? RightOutlined : LeftOutlined;
    const CollapsedIcon = direction === "rtl" ? LeftOutlined : RightOutlined;
    const IconComponent = siderCollapsed ? CollapsedIcon : OpenIcon;

    return <IconComponent {...iconProps} />;
  };

  const items = [
    {
      key: "schedule",
      icon: <CalendarOutlined />,
      label: (
        <Link to="/schedule-hb">
          {translate("schedule-hb.title", "Dienstplan")}
        </Link>
      ),
      style:
        currentPath === "/schedule-hb"
          ? {
              backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff", // Light blue background for dark mode, and original light blue for light mode
              color: mode === "dark" ? "#fff" : token.colorPrimary, // White text for dark mode, and primary text color for light mode
              borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
            }
          : {},
    },
    {
      key: "manage-users",
      icon: <UserOutlined />,
      label: <Link to="/manage-users">Manage Users</Link>,
      style:
        currentPath === "/manage-users"
          ? {
              backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff", // Light blue background for dark mode, and original light blue for light mode
              color: mode === "dark" ? "#fff" : token.colorPrimary, // White text for dark mode, and primary text color for light mode
              borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
            }
          : {},
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: translate("buttons.logout", "Logout"),
      onClick: handleLogoutClick,
    },
  ];

  const renderFooter = () => (
    <div
      style={{
        padding: "10px 16px",
        textAlign: "center",
        fontSize: isMobile ? "10px" : "11px",
        color: token.colorTextSecondary,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        marginTop: "16px",
      }}
    >
      <a
        href="https://www.jaazieldovale.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          marginTop: "8px",
          color: token.colorTextBase,
        }}
      >
        <CodeOutlined
          style={{
            fontSize: "18px",
            animation: "pop-up 4s ease-in-out infinite",
            marginBottom: isMobile ? "8px" : "4px",
          }}
        />
      </a>
      <span>Developed by Jaaziel do Vale</span>

      <style jsx>{`
        @keyframes pop-up {
          0% {
            transform: scale(1);
          }
          10% {
            transform: scale(1.15);
          }
          20% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );

  const renderMenu = () => (
    <Menu
      selectedKeys={[currentPath]}
      mode="inline"
      items={items}
      style={{
        paddingTop: "8px",
        border: "none",
        overflow: "auto",
        flex: 1,
        backgroundColor: mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
      }}
      onClick={(e) => {
        if (e.key !== "logout") {
          setMobileSiderOpen(false);
        }
      }}
    />
  );

  const renderDrawerSider = () => (
    <>
      <Drawer
        open={mobileSiderOpen}
        onClose={() => setMobileSiderOpen(false)}
        placement="left"
        closable={false}
        width={200}
        maskClosable={true}
        styles={{
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor:
              mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
          },
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            style={{
              padding: "0 16px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "64px",
              backgroundColor:
                mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
            }}
          >
            <RenderToTitle collapsed={false} onTitleClick={handleTitleClick} />
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>{renderMenu()}</div>

          <div
            style={{
              padding: "10px 16px",
              textAlign: "center",
              fontSize: "12px",
              color: token.colorTextSecondary,
              backgroundColor:
                mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
              marginTop: "auto",
            }}
          >
            {renderFooter()}
          </div>
        </div>
      </Drawer>

      <Button
        style={{
          ...drawerButtonStyles,
          position: "fixed",
          top: "15px",
          zIndex: 1000,
        }}
        size="large"
        onClick={() => setMobileSiderOpen(true)}
        icon={<BarsOutlined />}
      />
    </>
  );

  const siderStyles: React.CSSProperties = {
    backgroundColor: mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.zIndex = 999;
  }

  if (isMobile) {
    return renderDrawerSider();
  }

  return (
    <>
      {fixed && (
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            transition: "all 0.2s",
          }}
        />
      )}
      <Layout.Sider
        style={siderStyles}
        collapsible
        collapsed={siderCollapsed}
        onCollapse={(collapsed, type) => {
          if (type === "clickTrigger") {
            setSiderCollapsed(collapsed);
          }
        }}
        collapsedWidth={80}
        breakpoint="lg"
        trigger={
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor:
                mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
            }}
          >
            {renderClosingIcons()}
          </Button>
        }
      >
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            padding: siderCollapsed ? "0" : "0 16px",
            display: "flex",
            justifyContent: siderCollapsed ? "center" : "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor:
              mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
            fontSize: "14px",
          }}
        >
          <RenderToTitle
            collapsed={siderCollapsed}
            onTitleClick={handleTitleClick}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div style={{ flex: 1, overflow: "auto" }}>{renderMenu()}</div>

          {!siderCollapsed && (
            <div style={{ marginBottom: "60px" }}> {renderFooter()}</div>
          )}
        </div>
      </Layout.Sider>
    </>
  );
};

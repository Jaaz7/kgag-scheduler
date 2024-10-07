import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Grid,
  theme,
  ConfigProvider,
  MenuProps,
  Spin,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
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
import {
  authProviderClient,
  CustomCheckResponse,
} from "@/lib/auth-provider/auth-provider.client";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
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
  const [footerVisible, setFooterVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const [userType, setUserType] = useState<string | undefined>();
  const [scheduleId, setScheduleId] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      const authResponse: CustomCheckResponse =
        await authProviderClient.check();

      if (authResponse.authenticated) {
        setUserType(authResponse.user_type);
        setScheduleId(authResponse.schedule_id);
      }

      setLoading(false);
    };

    fetchAuthData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isDesktopView = window.innerWidth > 900;
      setIsDesktop(isDesktopView);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [siderCollapsed]);

  useEffect(() => {
    if (!siderCollapsed) {
      const timeout = setTimeout(() => {
        setFooterVisible(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setFooterVisible(false);
    }
  }, [siderCollapsed]);

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
  const isMobile = window.innerWidth <= 900;
  const RenderToTitle = TitleFromProps ?? ThemedTitleV2;
  const { showModal } = useModal();
  const { mode } = useContext(ColorModeContext);

  const handleLogoutClick = () => {
    setMobileSiderOpen(false);
    showModal({
      title: "Abmeldung bestätigen",
      content: () => <p>Sind Sie sicher, dass Sie sich abmelden möchten?</p>,
      onOk: confirmLogout,
      okText: "Abmelden",
      cancelText: "Abbrechen",
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

  const items: MenuProps["items"] = [];

  if (userType === "admin" && scheduleId === "admin") {
    items.push(
      {
        key: "schedule-admin",
        icon: <CalendarOutlined />,
        label: (
          <Link to="/schedule-admin">
            {translate("schedule-admin.title", "Dienstpläne")}
          </Link>
        ),
        style:
          currentPath === "/schedule-admin"
            ? {
                backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff",
                color: mode === "dark" ? "#fff" : token.colorPrimary,
                borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
              }
            : {},
      },
      {
        key: "admin-dashboard",
        icon: <BellOutlined />,
        label: <Link to="/admin-dashboard">Dashboard</Link>,
        style:
          currentPath === "/admin-dashboard"
            ? {
                backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff",
                color: mode === "dark" ? "#fff" : token.colorPrimary,
                borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
              }
            : {},
      },
      {
        key: "manage-users",
        icon: <UserOutlined />,
        label: <Link to="/manage-users">Benutzer verwalten</Link>,
        style:
          currentPath === "/manage-users"
            ? {
                backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff",
                color: mode === "dark" ? "#fff" : token.colorPrimary,
                borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
              }
            : {},
      }
    );
  } else if (userType === "standardbenutzer" && scheduleId === "hb-shop") {
    items.push(
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
                backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff",
                color: mode === "dark" ? "#fff" : token.colorPrimary,
                borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
              }
            : {},
      },
      {
        key: "user-dashboard",
        icon: <BellOutlined />,
        label: <Link to="/user-dashboard">Dashboard</Link>,
        style:
          currentPath === "/user-dashboard"
            ? {
                backgroundColor: mode === "dark" ? "#40a9ff" : "#e6f7ff",
                color: mode === "dark" ? "#fff" : token.colorPrimary,
                borderColor: mode === "dark" ? "#40a9ff" : token.colorPrimary,
              }
            : {},
      }
    );
  }

  items.push({
    key: "logout",
    icon: <LogoutOutlined />,
    label: translate("buttons.logout", "Abmelden"),
    onClick: handleLogoutClick,
  });

  const renderFooter = () => (
    <div
      style={{
        padding: "10px 16px",
        textAlign: "center",
        fontSize: isMobile ? "10px" : "11px",
        color: token.colorTextSecondary,
        marginTop: "16px",
        opacity: isDesktop ? (footerVisible ? 1 : 0) : undefined,
        transition: "opacity 0.3s ease",
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
              padding: "0 12px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "64px",
              backgroundColor:
                mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
              position: "sticky",
              top: 0,
              zIndex: 10,
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
          backgroundColor: mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
          borderColor: mode === "dark" ? "#2f437b" : "#1E90FF",
          borderWidth: "2px",
          borderStyle: "solid",
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
    position: "fixed",
    top: 0,
    zIndex: 999,
    width: siderCollapsed ? "80px" : "200px",
    overflow: "hidden",
  };

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

  if (isMobile) {
    return renderDrawerSider();
  }

  return (
    <>
      {
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
          }}
        />
      }
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
        trigger={
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor:
                mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
              borderBlockColor: "transparent",
            }}
          >
            {renderClosingIcons()}
          </Button>
        }
      >
        <div
          style={{
            width: siderCollapsed ? "80px" : "200px",
            padding: siderCollapsed ? "0" : "0 12px",
            display: "flex",
            justifyContent: siderCollapsed ? "center" : "flex-start",
            alignItems: "center",
            height: "64px",
            backgroundColor:
              mode === "dark" ? "#2a2a2a" : token.colorBgContainer,
            fontSize: "14px",
            zIndex: 10,
            position: "sticky",
            top: 0,
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
          <div style={{ flex: 1 }}>{renderMenu()}</div>

          {!siderCollapsed && (
            <div style={{ marginBottom: "55px" }}>{renderFooter()}</div>
          )}
        </div>
      </Layout.Sider>
    </>
  );
};

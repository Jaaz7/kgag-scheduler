import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Grid,
  theme,
  ConfigProvider,
  Modal,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BarsOutlined,
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useTranslate, useLogout, useLink } from "@refinedev/core";

import { drawerButtonStyles } from "./styles";
import type { RefineThemedLayoutV2SiderProps } from "./types";
import { ThemedTitleV2 } from "./ThemedTitle";
import { useThemedLayoutContext } from "./UseThemeLayoutContext";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
  Title: TitleFromProps,
  fixed,
  activeItemDisabled = false,
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
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    if (typeof window !== "undefined") {
      updatePath();
      window.addEventListener("popstate", updatePath);

      const handleHistoryChange = () => {
        setTimeout(updatePath, 0);
      };

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

  // Function to show the logout confirmation modal
  const handleLogoutClick = () => {
    console.log("Logout clicked! Opening modal..."); // Debugging line
    setIsLogoutModalVisible(true); // Show the modal
  };

  // Function to handle the confirmed logout
  const confirmLogout = () => {
    console.log("Confirming logout..."); // Debugging line
  setMobileSiderOpen(false); // Close the drawer first before logging out
  mutateLogout(); // Trigger the logout action
  setIsLogoutModalVisible(false); // Close the modal
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
          ? { backgroundColor: "#e6f7ff", color: token.colorPrimary }
          : {},
    },
    {
      key: "manage-users",
      icon: <UserOutlined />,
      label: <Link to="/manage-users">Manage Users</Link>,
      style:
        currentPath === "/manage-users"
          ? { backgroundColor: "#e6f7ff", color: token.colorPrimary }
          : {},
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: translate("buttons.logout", "Logout"),
      onClick: handleLogoutClick, // Open modal on click
    },
  ];

  const renderMenu = () => {
    return (
      <Menu
        selectedKeys={[currentPath]}
        mode="inline"
        items={items.map((item) => {
          if (item.key === "logout") {
            return {
              ...item,
              onClick: () => {
                handleLogoutClick(); // Show the logout modal
              },
            };
          }
          return item;
        })}
        style={{
          paddingTop: "8px",
          border: "none",
          overflow: "auto",
          height: "calc(100% - 72px)",
        }}
        onClick={(e) => {
          if (e.key !== "logout") {
            setMobileSiderOpen(false); // Close drawer for non-logout items
          }
        }}
      />
    );
  };

  const renderDrawerSider = () => {
    return (
      <>
        <Drawer
          open={mobileSiderOpen}
          onClose={() => setMobileSiderOpen(false)}
          placement="left"
          closable={false}
          width={200}
          styles={{ body: { padding: 0 } }}
          maskClosable={true}
        >
          <Layout>
            <Layout.Sider
              style={{
                height: "100vh",
                backgroundColor: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBgElevated}`,
              }}
            >
              <div
                style={{
                  width: "200px",
                  padding: "0 16px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "64px",
                  backgroundColor: token.colorBgElevated,
                }}
              >
                <RenderToTitle
                  collapsed={false}
                  onTitleClick={handleTitleClick}
                />
              </div>
              {renderMenu()} {/* Ensure logout button appears in the drawer */}
            </Layout.Sider>
          </Layout>
        </Drawer>
        <Button
          style={drawerButtonStyles}
          size="large"
          onClick={() => setMobileSiderOpen(true)}
          icon={<BarsOutlined />}
        />
      </>
    );
  };

  if (isMobile) {
    return renderDrawerSider();
  }

  const siderStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    borderRight: `1px solid ${token.colorBgElevated}`,
  };

  if (fixed) {
    siderStyles.position = "fixed";
    siderStyles.top = 0;
    siderStyles.height = "100vh";
    siderStyles.zIndex = 999;
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
              backgroundColor: token.colorBgElevated,
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
            backgroundColor: token.colorBgElevated,
            fontSize: "14px",
          }}
        >
          <RenderToTitle
            collapsed={siderCollapsed}
            onTitleClick={handleTitleClick}
          />
        </div>
        {renderMenu()}
      </Layout.Sider>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalVisible}
        onOk={confirmLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        okText="Logout"
        cancelText="Cancel"
        zIndex={3000} // Ensure modal appears above Drawer
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </>
  );
};

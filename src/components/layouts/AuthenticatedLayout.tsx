import React, { useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import { Layout as AntdLayout, Spin } from "antd";
import { Header } from "@components/header/Header";
import NotFound from "@/app/not-found";
import "@/styles/globals.css";
import { MainContent } from "@components/layouts/MainContent";
import { ThemedSiderV2 as Sider } from "@components/sidebar/Sider";
import { ThemedLayoutContextProvider } from "@components/sidebar/ThemedLayoutContext";
import { ColorModeContext } from "@/contexts/ColorModeContext";
import { ThemedTitleV2 } from "@components/sidebar/ThemedTitle";
import UserTypeWrapper from "@components/layouts/UserTypeWrapper";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    const validPaths = [
      "/",
      "/schedule-hb",
      "/manage-users",
      "/schedule-admin",
    ];
    setIsValidPath(validPaths.includes(pathname));
  }, [pathname]);

  if (isValidPath === false) {
    return <NotFound />;
  }

  return (
    <ThemedLayoutContextProvider>
      <UserTypeWrapper>
        {({ userType, scheduleId }) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            <Header />
            <div style={{ display: "flex", flexGrow: 1 }}>
              <AntdLayout style={{ display: "flex" }}>
                <Sider
                  Title={(titleProps) => (
                    <ThemedTitleV2
                      {...titleProps}
                      text={
                        userType === "admin" && scheduleId === "admin"
                          ? "Admin-Konto"
                          : userType === "standardbenutzer" &&
                            scheduleId === "hb-shop"
                          ? "Hofbräuhaus"
                          : ""
                      }
                    />
                  )}
                />
                <AntdLayout style={{ flexGrow: 1 }}>
                  <AntdLayout.Content>
                    <MainContent mode={mode}>{children}</MainContent>
                  </AntdLayout.Content>
                </AntdLayout>
              </AntdLayout>
            </div>
          </div>
        )}
      </UserTypeWrapper>
    </ThemedLayoutContextProvider>
  );
}

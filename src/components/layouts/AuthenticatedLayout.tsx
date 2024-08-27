import React, { useEffect, useState, Suspense, useContext } from "react";
import { usePathname } from "next/navigation";
import { Grid, Layout as AntdLayout } from "antd";
import { Header } from "@components/header/Header";
import NotFound from "@/app/not-found";
import "@/styles/globals.css";
import { MainContent } from "@components/layouts/MainContent";
import { ThemedSiderV2 as Sider } from "@components/sidebar/Sider";
import { useResponsiveSider } from "@components/layouts/useResponsiveHook";
import { ThemedLayoutContextProvider } from "@components/sidebar/ThemedLayoutContext";
import { ColorModeContext } from "@/contexts/ColorModeContext";
import { ThemedTitleV2 } from "@components/sidebar/ThemedTitle";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);
  const { siderCollapsed, setSiderCollapsed } = useResponsiveSider();
  const { mode } = useContext(ColorModeContext);

  // Check if the path is valid for authenticated routes
  useEffect(() => {
    const validPaths = ["/", "/schedule-hb", "/manage-users"];
    setIsValidPath(validPaths.includes(pathname));
  }, [pathname]);

  // Return NotFound component if the route is invalid
  if (isValidPath === false) {
    return <NotFound />;
  }

  return (
    <ThemedLayoutContextProvider>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flexGrow: 1 }}>
          <AntdLayout style={{ display: "flex" }}>
            <Sider
              siderCollapsed={siderCollapsed}
              setSiderCollapsed={setSiderCollapsed}
              Title={(titleProps) => (
                <ThemedTitleV2
                  {...titleProps}
                  text="HB Shop"
                  link="/schedule-hb"
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
    </ThemedLayoutContextProvider>
  );
}

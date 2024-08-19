import React, { Suspense } from "react";
import { DevtoolsProvider } from "@lib/devtools";
import { RealTimeProvider } from "@/lib/data-provider/realTimeProvider";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/ColorModeContext";
import { authProviderClient } from "@/lib/auth-provider";
import { dataProvider } from "@/lib/data-provider";
import AuthWrapper from "@/components/layouts/AuthWrapper";
import { resources } from "@/components/common/resources";
import { Spin } from "antd";

import "@/styles/globals.css";
import "@refinedev/antd/dist/reset.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RefineKbarProvider>
          <AntdRegistry>
            <ColorModeContextProvider>
              <DevtoolsProvider>
                <RealTimeProvider>
                  <Suspense fallback={<Spin size="large" />}>
                    <Refine
                      routerProvider={routerProvider}
                      authProvider={authProviderClient}
                      dataProvider={dataProvider}
                      notificationProvider={useNotificationProvider}
                      resources={resources}
                      options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        projectId: "fSe5j5-MWays6-B3H6IM",
                      }}
                    >
                      <AuthWrapper>{children}</AuthWrapper>
                      <RefineKbar />
                    </Refine>
                  </Suspense>
                </RealTimeProvider>
              </DevtoolsProvider>
            </ColorModeContextProvider>
          </AntdRegistry>
        </RefineKbarProvider>
      </body>
    </html>
  );
}

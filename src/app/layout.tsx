import React, { Suspense } from "react";
import { DevtoolsProvider } from "@lib/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/ColorModeContext";
import { authProviderClient } from "@/lib/auth-provider";
import { dataProvider } from "@/lib/data-provider";
import AuthWrapper from "@/components/layouts/AuthWrapper";
import { App, Spin } from "antd";
import { ModalProvider } from "@/contexts/ModalProvider";
import "@/styles/globals.css";
import "@refinedev/antd/dist/reset.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import { metadata as serverMetadata } from "@/lib/supabase/server";

export const metadata: Metadata = serverMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <App>
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider>
                <DevtoolsProvider>
                  <ModalProvider>
                    <Suspense
                      fallback={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            backgroundColor: "inherit",
                          }}
                        >
                          <Spin
                            size="large"
                            style={{
                              color: "inherit",
                            }}
                          />
                        </div>
                      }
                    >
                      <Refine
                        routerProvider={routerProvider}
                        authProvider={authProviderClient}
                        dataProvider={dataProvider}
                        notificationProvider={useNotificationProvider}
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
                  </ModalProvider>
                </DevtoolsProvider>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </App>
      </body>
    </html>
  );
}

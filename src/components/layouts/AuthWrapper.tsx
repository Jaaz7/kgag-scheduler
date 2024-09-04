"use client";

import React, { useEffect, useState, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";
import { Spin } from "antd";
import { authProviderClient } from "@/lib/auth-provider";
import { ColorModeContext } from "@/contexts/ColorModeContext";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const pathname = usePathname();
  const router = useRouter();
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authProviderClient.check();
        setIsAuthenticated(response.authenticated);
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsAuthenticated(false);
      } finally {
        setInitialLoad(false);
      }
    };
    checkAuth();
  }, [pathname, router]);

  if (initialLoad) {
    const backgroundColor = mode === "dark" ? "#141414" : "#fff";
    const spinnerColor = mode === "dark" ? "#40a9ff" : "#1890ff";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: backgroundColor,
        }}
      >
        <Spin
          size="large"
          style={{
            color: spinnerColor,
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

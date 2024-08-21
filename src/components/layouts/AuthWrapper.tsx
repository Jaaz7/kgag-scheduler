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
      const response = await authProviderClient.check();
      setIsAuthenticated(response.authenticated);

      if (!response.authenticated && pathname !== "/") {
        router.push(response.redirectTo || "/");
      }

      setInitialLoad(false);
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
          color: mode === "dark" ? "#fff" : "#000",
          transition: "background-color 0.3s ease",
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

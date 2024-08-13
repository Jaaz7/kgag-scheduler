"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";
import { Spin } from "antd";
import { authProviderClient } from "@/lib/auth-provider";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const pathname = usePathname();
  const router = useRouter();

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

  if (!isAuthenticated) {
    return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

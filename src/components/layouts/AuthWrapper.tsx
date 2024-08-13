"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import AuthenticatedLayout from "./AuthenticatedLayout";
import UnauthenticatedLayout from "./UnauthenticatedLayout";
import { Spin } from "antd";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where no layout should be applied
  const noLayoutRoutes = ["/404", "/not-found"];

  // Handle the root path ("/") using the UnauthenticatedLayout
  if (pathname === "/") {
    return (
      <Suspense fallback={<Spin size="large" />}>
        <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
      </Suspense>
    );
  }

  // Handle no layout routes by returning children directly
  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Default case: use the AuthenticatedLayout for all other routes
  return (
    <Suspense fallback={<Spin size="large" />}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}

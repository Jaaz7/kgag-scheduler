import React, { Suspense } from "react";
import "@/styles/globals.css";
import { ThemedLayoutContextProvider } from "@components/sidebar/ThemedLayoutContext";
``;

interface UnauthenticatedLayoutProps {
  children: React.ReactNode | null;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({
  children,
}) => {
  return <>{children}</>;
};

export default UnauthenticatedLayout;

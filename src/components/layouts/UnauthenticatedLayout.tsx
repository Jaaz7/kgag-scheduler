import React, { Suspense } from "react";
import "@/styles/globals.css";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode | null;
}

const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({
  children,
}) => {
  return <>{children}</>;
};

export default UnauthenticatedLayout;

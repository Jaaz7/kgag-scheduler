import React, { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ThemedLayoutV2, ThemedTitleV2 } from "@components/sidebar";
import { Header } from "@components/header/Header";
import NotFound from "@/app/not-found";
import "@/styles/globals.css";
import { Spin } from "antd";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);

  useEffect(() => {
    const validPaths = ["/", "/schedule-hb", "/manage-users"]; // Include root path "/"

    if (validPaths.includes(pathname)) {
      setIsValidPath(true);
    } else {
      setIsValidPath(false);
    }
  }, [pathname]);

  console.log("Rendering AuthenticatedLayout:");
  console.log("isValidPath:", isValidPath);
  console.log("pathname:", pathname);

  if (isValidPath === false) {
    console.log("Rendering NotFound component.");
    return <NotFound />;
  }

  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => (
        <ThemedTitleV2 {...titleProps} text="HB Shop" link="/schedule-hb" />
      )}
    >
      <Suspense fallback={<Spin size="large" />}>
        {children}
      </Suspense>
    </ThemedLayoutV2>
  );
}

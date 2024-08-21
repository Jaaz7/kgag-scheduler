import React, { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { ThemedLayoutV2, ThemedTitleV2 } from "@components/sidebar";
import { Header } from "@components/header/Header";  // Header with ThemeSwitcher inside
import NotFound from "@/app/not-found";
import "@/styles/globals.css";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);

  useEffect(() => {
    const validPaths = ["/", "/schedule-hb", "/manage-users"];
    if (validPaths.includes(pathname)) {
      setIsValidPath(true);
    } else {
      setIsValidPath(false);
    }
  }, [pathname]);

  if (isValidPath === false) {
    return <NotFound />;
  }

  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => (
        <ThemedTitleV2 {...titleProps} text="HB Shop" link="/schedule-hb" />
      )}
    >
      <Suspense>{children}</Suspense>
    </ThemedLayoutV2>
  );
}

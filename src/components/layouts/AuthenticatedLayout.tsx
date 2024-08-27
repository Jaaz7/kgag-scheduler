import React, { useEffect, useState, Suspense, useContext } from "react";
import { usePathname } from "next/navigation";
import { ThemedLayoutV2, ThemedTitleV2 } from "@components/sidebar";
import { Header } from "@components/header/Header";
import NotFound from "@/app/not-found";
import "@/styles/globals.css";
import { ColorModeContext } from "@/contexts/ColorModeContext";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();
  const [isValidPath, setIsValidPath] = useState<boolean | null>(null);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);
  const { mode } = useContext(ColorModeContext);

  useEffect(() => {
    const validPaths = ["/", "/schedule-hb", "/manage-users"];
    if (validPaths.includes(pathname)) {
      setIsValidPath(true);
    } else {
      setIsValidPath(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 991);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isValidPath === false) {
    return <NotFound />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <div style={{ display: "flex", flexGrow: 1 }}>
        <ThemedLayoutV2
          siderCollapsed={isSiderCollapsed}
          setSiderCollapsed={setIsSiderCollapsed}
          Title={(titleProps) => (
            <ThemedTitleV2 {...titleProps} text="HB Shop" link="/schedule-hb" />
          )}
        >
          <div
            style={{
              marginLeft: isDesktop
                ? isSiderCollapsed
                  ? "80px"
                  : "200px"
                : "0",
              flexGrow: 1,
              padding: "12px",
              overflowY: "auto",
              backgroundColor: mode === "dark" ? "#141414" : "#f5f5f5",
              transition: "margin-left 0.2s ease",
            }}
          >
            <Suspense>{children}</Suspense>
          </div>
        </ThemedLayoutV2>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

export const useResponsiveSider = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      const isDesktopView = window.innerWidth > 991;
      setIsDesktop(isDesktopView);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [siderCollapsed]);

  return { siderCollapsed, setSiderCollapsed, isDesktop };
};

import { useContext } from "react";

import { ThemedLayoutContext } from "./ThemedLayoutContext";
import type { IThemedLayoutContext } from "./IThemedLayoutContext";

export type UseThemedLayoutContextType = IThemedLayoutContext;

export const useThemedLayoutContext = (): UseThemedLayoutContextType => {
  const {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  } = useContext(ThemedLayoutContext);

  return {
    mobileSiderOpen,
    siderCollapsed,
    setMobileSiderOpen,
    setSiderCollapsed,
  };
};

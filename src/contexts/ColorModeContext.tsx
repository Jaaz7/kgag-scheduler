"use client";

import { RefineThemes } from "@refinedev/antd";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import Cookies from "js-cookie";
import React, {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

type ColorModeContextProviderProps = {
  defaultMode?: string;
};

export const ColorModeContextProvider: React.FC<
  PropsWithChildren<ColorModeContextProviderProps>
> = ({ children }) => {
  const [mode, setMode] = useState("light");

  useEffect(() => {
    const storedTheme = Cookies.get("theme");

    if (storedTheme) {
      setMode(storedTheme);
    }
  }, []);

  const setColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    Cookies.set("theme", newMode, { expires: 365 });
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  useEffect(() => {
    document.body.style.transition = "background-color 0.3s ease";
    document.body.style.backgroundColor =
      mode === "dark" ? "#141414" : "#ffffff";
  }, [mode]);

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
          token: {
            colorPrimary: mode === "dark" ? "#1890ff" : "#0050b3",
            colorBgBase: mode === "dark" ? "#141414" : "#ffffff",
            colorTextBase: mode === "dark" ? "#f0f0f0" : "#000000",
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};

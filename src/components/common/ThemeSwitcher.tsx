import React, { useContext } from "react";
import { Switch } from "antd";
import { ColorModeContext } from "@/contexts/ColorModeContext";

const ThemeSwitcher = () => {
  const { mode, setMode } = useContext(ColorModeContext);

  const handleChange = (checked: boolean) => {
    setMode(checked ? "dark" : "light");
  };

  return (
    <Switch
      checked={mode === "dark"}
      onChange={handleChange}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      style={{
        backgroundColor: mode === "dark" ? "#40a9ff" : "#f5f5f5",
        borderColor: mode === "dark" ? "#40a9ff" : "#d9d9d9",
        color: mode === "dark" ? "#fff" : "#000",
      }}
    />
  );
};

export default ThemeSwitcher;

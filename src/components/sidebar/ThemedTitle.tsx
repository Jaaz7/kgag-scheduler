import React from "react";
import { Typography, theme, Space } from "antd";
import type { RefineLayoutThemedTitleProps } from "./types";
import { BankOutlined } from "@ant-design/icons";

export const ThemedTitleV2: React.FC<RefineLayoutThemedTitleProps> = ({
  collapsed,
  icon: iconFromProps,
  text: textFromProps,
  wrapperStyles,
  onTitleClick,
}) => {
  const defaultIcon = iconFromProps ?? <BankOutlined />;
  const defaultText = textFromProps;

  const { token } = theme.useToken();

  const Content = (
    <Space
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "inherit",
        cursor: "pointer",
        ...wrapperStyles,
      }}
      onClick={onTitleClick}
    >
      {React.isValidElement(defaultIcon) &&
        React.cloneElement(defaultIcon as React.ReactElement, {
          style: { fontSize: 24, color: token.colorPrimary },
        })}

      {!collapsed && (
        <Typography.Title
          style={{
            fontSize: "inherit",
            marginBottom: 0,
            fontWeight: 700,
          }}
        >
          {defaultText}
        </Typography.Title>
      )}
    </Space>
  );

  return Content;
};

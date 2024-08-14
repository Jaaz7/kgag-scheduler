import React from "react";
import { Avatar as AntdAvatar, AvatarProps } from "antd";

type Props = AvatarProps & {
  name?: string;
  initials?: string;
};

export const CustomAvatar = React.forwardRef<HTMLSpanElement, Props>(
  ({ initials, name, style, ...rest }, ref) => {
    return (
      <AntdAvatar
        {...rest}
        ref={ref}
        alt={name}
        size="small"
        style={{
          backgroundColor: "#1890ff",
          display: "flex",
          alignItems: "center",
          border: "none",
          ...style,
        }}
        {...rest}
      >
        {initials}
      </AntdAvatar>
    );
  }
);

import React from "react";
import { Avatar as AntdAvatar, AvatarProps } from "antd";
import { getNameInitials } from "@/lib/date/get-name-initials";

type Props = AvatarProps & {
  name?: string;
};

export const CustomAvatar = React.forwardRef<HTMLSpanElement, Props>(
  ({ name, style, ...rest }, ref) => {
    return (
      <AntdAvatar
        {...rest}
        ref={ref}
        alt={name}
        size="small"
        style={{
          backgroundColor: "#87d068",
          display: "flex",
          alignItems: "center",
          border: "none",
          ...style,
        }}
        {...rest}
      >
        {getNameInitials(name || "")}
      </AntdAvatar>
    );
  }
);

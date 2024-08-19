// resources.ts
import { IResourceItem } from "@refinedev/core";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "schedule-hb",
    list: "/schedule-hb",
    meta: {
      label: "Schedule HB",
      icon: <CalendarOutlined />,
    },
  },
  {
    name: "manage-users",
    list: "/manage-users",
    meta: {
      label: "Manage Users",
      icon: <UserOutlined />,
    },
  },
];

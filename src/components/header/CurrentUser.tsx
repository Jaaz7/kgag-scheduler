import React, { useEffect, useState } from "react";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { Button, Popover } from "antd";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { SettingOutlined } from "@ant-design/icons";
import { AccountSettings } from "@/components/header/AccountSettings";
import { Text } from "@components/common/Text";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabaseBrowserClient.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);

  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Text strong style={{ padding: "12px 20px" }}>
        {user?.email} {/* Displaying the user's email */}
      </Text>
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setIsOpen(true)}
        >
          Account Settings
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ padding: 0 }}
        overlayStyle={{ zIndex: 999 }}
        content={content}
      >
        <CustomAvatar
          name={user?.email}
          src={user?.avatar_url}
          size="default"
          style={{ cursor: "pointer" }}
        />
      </Popover>
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={user.id}
        />
      )}
    </>
  );
};

export default CurrentUser;
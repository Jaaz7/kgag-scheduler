import React, { useEffect, useState } from "react";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { Button, Popover } from "antd";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { SettingOutlined } from "@ant-design/icons";
import { AccountSettings } from "@/components/header/AccountSettings";
import { Text } from "@components/common/Text";
import { getNameInitials } from "@lib/date/get-name-initials";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [initials, setInitials] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch authenticated user and their profile data from Supabase
  const fetchUser = async () => {
    try {
      const { data: authData, error: authError } =
        await supabaseBrowserClient.auth.getUser();
      if (authError) throw new Error(authError.message);

      const { data: profileData, error: profileError } =
        await supabaseBrowserClient
          .from("profiles")
          .select("*")
          .eq("user_id", authData.user?.id)
          .single();
      if (profileError) throw new Error(profileError.message);

      const fullName = profileData?.name || authData.user?.email;
      setUser({
        ...profileData,
        email: authData.user?.email,
        name: fullName,
        user_id: authData.user?.id,
      });

      setInitials(getNameInitials(fullName));

      // Fetch signed URL for the avatar if available
      if (profileData?.avatar_url) {
        const { data: signedUrlData, error: signedUrlError } =
          await supabaseBrowserClient.storage
            .from("avatars")
            .createSignedUrl(profileData.avatar_url, 60);
        if (signedUrlError) throw new Error(signedUrlError.message);

        setAvatarUrl(signedUrlData?.signedUrl || null);
      } else {
        setAvatarUrl(null);
      }
    } catch (error) {
      console.error(
        "Error fetching user:",
        error instanceof Error ? error.message : error
      );
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user on component mount

    // Subscribe to real-time profile updates
    const channel = supabaseBrowserClient
      .channel("public:profiles")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user?.user_id}`,
        },
        async (payload) => {
          const updatedAvatarUrl = payload.new.avatar_url;
          if (updatedAvatarUrl !== avatarUrl) {
            // Fetch new signed URL or handle avatar removal
            if (updatedAvatarUrl) {
              const { data: signedUrlData, error: signedUrlError } =
                await supabaseBrowserClient.storage
                  .from("avatars")
                  .createSignedUrl(updatedAvatarUrl, 60);
              if (signedUrlError) {
                console.error(
                  "Error fetching signed URL:",
                  signedUrlError.message
                );
              } else {
                setAvatarUrl(signedUrlData?.signedUrl || null);
              }
            } else {
              setAvatarUrl(null); // Avatar was removed
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowserClient.removeChannel(channel); // Cleanup on unmount
    };
  }, [avatarUrl, user?.user_id]);

  // Handle avatar updates
  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl);
  };

  // Popover content for user actions
  const content = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Text strong style={{ padding: "12px 20px" }}>
        {user?.email}
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
          initials={initials}
          src={avatarUrl}
          size="large"
          style={{
            cursor: "pointer",
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Popover>
      {user && (
        <AccountSettings
          opened={isOpen}
          setOpened={setIsOpen}
          userId={user.user_id}
          onAvatarUpdate={handleAvatarUpdate}
        />
      )}
    </>
  );
};

export default CurrentUser;

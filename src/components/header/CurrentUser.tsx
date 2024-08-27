import React, { useEffect, useState } from "react";
import { CustomAvatar } from "@components/common/CustomAvatar";
import { Button, Popover } from "antd";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { SettingOutlined } from "@ant-design/icons";
import { AccountSettings } from "@/components/header/AccountSettings";
import { Text } from "@components/common/Text";
import { getNameInitials } from "@components/common/get-name-initials";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [initials, setInitials] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [accountSettingsData, setAccountSettingsData] = useState<any | null>(
    null
  );
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  const isUrlExpired = (expiryTimestamp: number) => {
    return Date.now() > expiryTimestamp;
  };

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

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

      const cachedAvatarData = localStorage.getItem("avatarUrlCache");
      if (cachedAvatarData) {
        const { signedUrl, expiry } = JSON.parse(cachedAvatarData);
        setAvatarUrl(signedUrl);
        preloadImage(signedUrl);

        if (!isUrlExpired(expiry)) {
          return;
        } else {
          localStorage.removeItem("avatarUrlCache");
        }
      }

      fetchSignedUrl(profileData.avatar_url);
    } catch (error) {
      console.error(
        "Error fetching user:",
        error instanceof Error ? error.message : error
      );
    }
  };

  // Fetch signed avatar URL, updating cache and state
  const fetchSignedUrl = async (
    avatarUrl: string | null,
    isBackground = false
  ) => {
    if (avatarUrl) {
      try {
        const { data: signedUrlData, error: signedUrlError } =
          await supabaseBrowserClient.storage
            .from("avatars")
            .createSignedUrl(avatarUrl, CACHE_DURATION / 1000);
        if (signedUrlError) throw new Error(signedUrlError.message);

        const newSignedUrl = signedUrlData?.signedUrl || null;

        if (!isBackground) {
          setAvatarUrl(newSignedUrl);
        }

        localStorage.setItem(
          "avatarUrlCache",
          JSON.stringify({
            signedUrl: newSignedUrl,
            expiry: Date.now() + CACHE_DURATION,
          })
        );

        if (newSignedUrl) {
          preloadImage(newSignedUrl);
        }
      } catch (error) {
        console.error(
          "Error fetching signed URL:",
          error instanceof Error ? error.message : error
        );
      }
    } else {
      setAvatarUrl(null);
      localStorage.removeItem("avatarUrlCache");
    }
  };

  useEffect(() => {
    fetchUser();

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
        (payload) => {
          const updatedAvatarUrl = payload.new.avatar_url;
          if (updatedAvatarUrl !== avatarUrl) {
            fetchSignedUrl(updatedAvatarUrl);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowserClient.removeChannel(channel);
    };
  }, [avatarUrl, user?.user_id]);

  const handleAvatarUpdate = (newAvatarUrl: string | null) => {
    setAvatarUrl(newAvatarUrl);
    localStorage.removeItem("avatarUrlCache");
    fetchSignedUrl(newAvatarUrl);
  };

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
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
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
          preloadedData={accountSettingsData}
          isSettingsLoaded={isSettingsLoaded}
        />
      )}
    </>
  );
};

export default CurrentUser;

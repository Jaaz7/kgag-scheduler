import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authProviderClient, CustomCheckResponse } from "@/lib/auth-provider";
import { Spin } from "antd";
import NotFound from "@/app/not-found";

interface UserTypeWrapperProps {
  children: (props: {
    userType?: string;
    scheduleId?: string;
  }) => React.ReactNode;
}

const ALLOWED_ROUTES: Record<string, Record<string, string[]>> = {
  admin: {
    admin: ["/", "/schedule-admin", "/manage-users"],
  },
  standardbenutzer: {
    "hb-shop": ["/", "/schedule-hb"],
  },
};

export default function UserTypeWrapper({ children }: UserTypeWrapperProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<string | undefined>();
  const [scheduleId, setScheduleId] = useState<string | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUserType = async () => {
      const authData =
        (await authProviderClient.check()) as CustomCheckResponse;

      if (authData.authenticated) {
        const { user_type, schedule_id } = authData;
        setUserType(user_type);
        setScheduleId(schedule_id);

        if (
          user_type &&
          schedule_id &&
          ALLOWED_ROUTES[user_type] &&
          ALLOWED_ROUTES[user_type][schedule_id] &&
          ALLOWED_ROUTES[user_type][schedule_id].includes(pathname)
        ) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } else {
        router.push("/");
        return;
      }
      setLoading(false);
    };

    checkUserType();
  }, [router, pathname]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        
      </div>
    );
  }

  if (isAuthorized === false) {
    return <NotFound />;
  }

  return <>{children({ userType, scheduleId })}</>;
}

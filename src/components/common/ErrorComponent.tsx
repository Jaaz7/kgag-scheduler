"use client";

import React, { useEffect, useState } from "react";
import { useGo, useResource, useRouterType } from "@refinedev/core";
import type { RefineErrorPageProps } from "@refinedev/ui-types";
import { Button, Result, Typography, Space, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { authProviderClient, CustomCheckResponse } from "@/lib/auth-provider/auth-provider.client";
import { getDefaultRedirect } from "@components/common/redirect";
import router from "next/router";

export const ErrorComponent: React.FC<RefineErrorPageProps> = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [redirectTo, setRedirectTo] = useState<string>("/");
  const translate = useTranslate();
  const go = useGo();
  const routerType = useRouterType();

  const { resource } = useResource();

  useEffect(() => {
    const fetchUserData = async () => {
      const response =
        (await authProviderClient.check()) as CustomCheckResponse;

      if (response.authenticated) {
        const redirectPath = getDefaultRedirect(
          response.user_type,
          response.schedule_id
        );
        setRedirectTo(redirectPath);
      }
    };

    fetchUserData();

    if (resource) {
      setErrorMessage(
        translate(
          "pages.error.info",
          {
            action: "",
            resource: resource?.name,
          },
          `You may have forgotten to add a component to "${resource?.name}" resource.`
        )
      );
    }
  }, [resource, translate]);

  return (
    <Result
      status="404"
      title="404"
      extra={
        <Space direction="vertical" size="large">
          <Space>
            <Typography.Text>
              {translate(
                "pages.error.404",
                "Sorry, the page you visited does not exist."
              )}
            </Typography.Text>
            {errorMessage && (
              <Tooltip title={errorMessage}>
                <InfoCircleOutlined data-testid="error-component-tooltip" />
              </Tooltip>
            )}
          </Space>

          <Button
            type="primary"
            onClick={() => {
              if (routerType === "legacy") {
                router.push(redirectTo);
              } else {
                go({ to: redirectTo });
              }
            }}
          >
            {translate("pages.error.backHome", "Back Home")}
          </Button>
        </Space>
      }
    />
  );
};

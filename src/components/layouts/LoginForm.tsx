"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  message,
  theme,
  Typography,
  Switch,
  Spin,
  Input,
  InputRef,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  authProviderClient,
  CustomCheckResponse,
} from "@/lib/auth-provider/auth-provider.client";
import { ColorModeContext } from "@/contexts/ColorModeContext";
import { getDefaultRedirect } from "@components/common/redirect";
import { supabaseBrowserClient } from "@lib/supabase/client";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const { token } = useToken();
  const screens = useBreakpoint();
  const router = useRouter();
  const { mode, setMode } = useContext(ColorModeContext);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [userType, setUserType] = useState<string | undefined>();
  const [scheduleId, setScheduleId] = useState<string | undefined>();
  const emailInputRef = useRef<InputRef>(null);
  const passwordInputRef = useRef<InputRef>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      form.setFieldsValue({ email: storedEmail });
    }

    setTimeout(() => {
      const emailValue = form.getFieldValue("email");

      if (emailValue && passwordInputRef.current) {
        passwordInputRef.current.focus();
      } else if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 50);

    const checkAuth = async () => {
      const response =
        (await authProviderClient.check()) as CustomCheckResponse;

      if (response.authenticated) {
        setUserType(response.user_type);
        setScheduleId(response.schedule_id);

        const redirectTo = getDefaultRedirect(
          response.user_type,
          response.schedule_id
        );

        router.push(redirectTo);
      } else {
        router.push("/");
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, form]);

  const onFinish = async (values: any) => {
    setLoggingIn(true);
    const { email, password, remember } = values;

    const response = await authProviderClient.login({ email, password });

    if (response.success) {
      localStorage.setItem("lastLoginTime", Date.now().toString());
      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      try {
        const userResponse = await supabaseBrowserClient.auth.getUser();
        const userId = userResponse.data.user?.id;

        if (userId) {
          const { data: profileData, error: profileError } =
            await supabaseBrowserClient
              .from("profiles")
              .select("name")
              .eq("user_id", userId)
              .single();

          if (profileError || !profileData) {
            console.error("Error fetching profile:", profileError?.message);
            message.error(
              "Anmeldung erfolgreich, aber Benutzerinformationen konnten nicht abgerufen werden."
            );
          } else {
            const { name } = profileData;
            message.success(`Willkommen, ${name || email}!`);
          }
        }

        const checkResponse =
          (await authProviderClient.check()) as CustomCheckResponse;
        const redirectTo = getDefaultRedirect(
          checkResponse.user_type,
          checkResponse.schedule_id
        );
        router.push(redirectTo);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        message.error(
          "Beim Abrufen des Benutzerprofils ist ein Fehler aufgetreten."
        );
      }
    } else {
      message.error(
        "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort."
      );
      form.setFieldsValue({ password: "" });
      setTimeout(() => {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }, 50);
      setLoggingIn(false);
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const styles = {
    container: {
      padding: `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
      maxWidth: "100%",
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "left" as const,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: token.fontSizeHeading3,
    },
    section: {
      backgroundColor: token.colorBgContainer,
      display: "flex",
      justifyContent: "center",
      alignItems: screens.xs ? "flex-start" : "center",
      minHeight: "100vh",
      paddingTop: screens.xs ? "40px" : "0",
    },
    svgIcon: {
      width: "25px",
      height: "24px",
      fill: token.colorPrimary,
      marginRight: "8px",
      marginTop: "-20px",
    },
  };

  if (loading || loggingIn) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              fill="currentColor"
              className="bi bi-buildings"
              viewBox="0 0 16 16"
              style={styles.svgIcon}
            >
              <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
              <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
            </svg>
            <Title style={styles.title}>Einloggen</Title>
          </div>
          <Switch
            checked={mode === "dark"}
            onChange={handleToggleMode}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
            style={{
              backgroundColor: mode === "dark" ? "#40a9ff" : "#f5f5f5",
              borderColor: mode === "dark" ? "#40a9ff" : "#d9d9d9",
              color: mode === "dark" ? "#fff" : "#000",
            }}
          />
        </div>
        <Form
          form={form}
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Bitte geben Sie Ihre E-Mail ein!",
              },
            ]}
          >
            <Input
              ref={emailInputRef}
              prefix={<MailOutlined />}
              placeholder="E-Mail"
              allowClear
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Bitte geben Sie Ihr Passwort ein!",
              },
            ]}
          >
            <Input.Password
              ref={passwordInputRef}
              prefix={<LockOutlined />}
              type="password"
              placeholder="Passwort"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Angemeldet bleiben</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Anmelden
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

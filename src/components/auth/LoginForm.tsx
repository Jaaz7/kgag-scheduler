"use client"

import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Input,
  message,
  theme,
  Typography,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authProviderClient } from "@/lib/auth-provider";
import "@/styles/globals.css";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const { token } = useToken();
  const screens = useBreakpoint();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      form.setFieldsValue({ email: storedEmail });
    }

    const checkAuth = async () => {
      const response = await authProviderClient.check();
      if (response.authenticated) {
        router.push("/schedule-hb");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, form]);

  const onFinish = async (values: any) => {
    const { email, password, remember } = values;

    const response = await authProviderClient.login({ email, password });

    if (response.success) {
      if (remember) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/schedule-hb");
    } else {
      message.error("Login failed. Please check your email and password.");
      form.setFieldsValue({ password: "" });
    }
  };

  const styles = {
    container: {
      padding: `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    header: {
      marginBottom: token.marginXL,
      textAlign: "left" as const,
    },
    title: {
      fontSize: token.fontSizeHeading3,
    },
    section: {
      backgroundColor: token.colorBgContainer,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
  };

  if (loading) {
    return null;
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={styles.title}>Sign in</Title>
        </div>
        <Form
          form={form}
          name="normal_login"
          initialValues={{
            remember: true,
          }}
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
                message: "Please input your Email!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

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
    // Prefill email if remembered in localStorage
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      form.setFieldsValue({ email: storedEmail });
    }

    // Check authentication status
    const checkAuth = async () => {
      const response = await authProviderClient.check();
      if (response.authenticated) {
        router.push("/schedule-hb"); // Redirect if authenticated
      } else {
        setLoading(false); // Allow login form if not authenticated
      }
    };

    checkAuth();
  }, [router, form]);

  const onFinish = async (values: any) => {
    const { email, password, remember } = values;

    const response = await authProviderClient.login({ email, password });

    if (response.success) {
      if (remember) {
        localStorage.setItem("rememberedEmail", email); // Save email if "Remember me" is checked
      } else {
        localStorage.removeItem("rememberedEmail"); // Clear saved email
      }
      router.push("/schedule-hb"); // Redirect on successful login
    } else {
      message.error("Login failed. Please check your email and password.");
      form.setFieldsValue({ password: "" }); // Clear password field on error
    }
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
    },
  };

  if (loading) {
    return null; // Hide form while checking authentication
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
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
          <Title style={styles.title}>Sign in</Title>
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

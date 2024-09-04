"use client";

import LoginForm from "@components/layouts/LoginForm";
import { Spin } from "antd";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

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
        <Spin size="large" />
      </div>
    );
  }

  return <LoginForm />;
}

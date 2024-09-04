"use client";

import { Spin } from "antd";
import React, { useEffect, useState } from "react";

export default function ScheduleAdminPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    const currentTime = Date.now();

    if (lastLoginTime) {
      const timeDiff = currentTime - parseInt(lastLoginTime, 10);

      if (timeDiff < 2000) {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
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
  return (
    <div>
      <h1>Schedule Admin Page</h1>
      <h3>Only Admins should see this.</h3>
    </div>
  );
}

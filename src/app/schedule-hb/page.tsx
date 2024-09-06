"use client";

import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { ScheduleGrid } from "@/components/common/CalendarUser";

export default function ScheduleHBPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    const currentTime = Date.now();

    if (lastLoginTime) {
      const timeDiff = currentTime - parseInt(lastLoginTime, 10);

      if (timeDiff < 2000) {
        setTimeout(() => {
          setLoading(false);
        }, 400);
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

  return <ScheduleGrid />;
}

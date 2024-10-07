"use client";

import { Spin, Button, Col } from "antd";
import React, { useEffect, useState } from "react";
import { ScheduleGridAdminHB } from "@components/common/CalendarUserAdmin";
import CreateScheduleButtonHB from "@lib/hb-algorithm/CreateSchedule";
import hbImage from "@components/img/hb.png";

export default function ScheduleAdminPage() {
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if it's mobile based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Manage loading state and last login check
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

  // Mobile version layout
  const renderMobile = () => {
    if (selectedShop === "Hofbrauhaus") {
      return (
        <div>
          <ScheduleGridAdminHB setSelectedShop={setSelectedShop} />{" "}
          {/* Show Hofbrauhaus schedule */}
        </div>
      );
    }
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Col style={{ marginTop: "10px", padding: "10px" }}>
          <CreateScheduleButtonHB />
        </Col>
        <p style={{ fontSize: "22px" }}>Dienstpläne: Wähle einen Shop aus</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {/* Hofbrauhaus Shop Button */}
          <div
            onClick={() => setSelectedShop("Hofbrauhaus")}
            style={{
              width: "150px",
              height: "150px",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={hbImage.src}
              alt="Hofbräuhaus"
              style={{ maxWidth: "60%" }}
            />
          </div>

          {/* Disabled Button for Other Shops */}
          <div
            style={{
              width: "150px",
              height: "150px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
              borderRadius: "20px",
              boxShadow: "none",
              transition: "all 0.3s ease",
            }}
          >
            <h3 style={{ color: "#a0a0a0" }}>Anderer Shop...</h3>
          </div>
          <div
            style={{
              width: "150px",
              height: "150px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
              borderRadius: "20px",
              boxShadow: "none",
              transition: "all 0.3s ease",
            }}
          >
            <h3 style={{ color: "#a0a0a0" }}>Anderer Shop...</h3>
          </div>
        </div>
      </div>
    );
  };

  // Render mobile or desktop layout based on screen size
  if (isMobile) {
    return renderMobile();
  }

  // Desktop version layout
  if (!selectedShop) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Col style={{ padding: "10px" }}>
          <CreateScheduleButtonHB />
        </Col>
        <p style={{ fontSize: "25px" }}>Dienstpläne: Wähle einen Shop aus</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {/* Hofbrauhaus Shop Button */}
          <div
            onClick={() => setSelectedShop("Hofbrauhaus")}
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={hbImage.src}
              alt="Hofbräuhaus"
              style={{ maxWidth: "60%" }}
            />
          </div>

          <div
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
              borderRadius: "20px",
              boxShadow: "none",
              transition: "all 0.3s ease",
            }}
          >
            <h3 style={{ color: "#a0a0a0" }}>Anderer Shop...</h3>
          </div>
          <div
            style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#e0e0e0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "default",
              borderRadius: "20px",
              boxShadow: "none",
              transition: "all 0.3s ease",
            }}
          >
            <h3 style={{ color: "#a0a0a0" }}>Anderer Shop...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (selectedShop === "Hofbrauhaus") {
    return (
      <div>
        <ScheduleGridAdminHB setSelectedShop={setSelectedShop} />{" "}
      </div>
    );
  }

  return null;
}

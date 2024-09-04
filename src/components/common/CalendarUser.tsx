import React from "react";
import { Row, Col, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Mode } from "fs";

export const ScheduleGrid: React.FC = () => {
  const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const timeslots = ["09:00 - 16:30", "13:00 - 20:30", "15:00 - 22:30"];
  const Mode = ["dark", "light"];
  return (
    <div
      style={{ padding: "20px", textAlign: "center", backgroundColor: "#fff" }}
    >
      {/* Month Header */}
      <div className="schedule-header">Month: 01 - 07</div>

      {/* Time Slots Header */}
      <Row gutter={16} className="time-header">
        <Col span={4} />
        {timeslots.map((slot) => (
          <Col span={6} key={slot}>
            {slot}
          </Col>
        ))}
      </Row>

      {/* Grid for Days and Time Slots */}
      {days.map((day, index) => (
        <Row gutter={16} key={day} style={{ marginTop: "10px" }}>
          <Col span={4} className="day-column">
            {day}
            <br />0{index + 1}
          </Col>
          {timeslots.map((_, timeIndex) => (
            <Col span={6} key={timeIndex} className="time-slot"></Col>
          ))}
        </Row>
      ))}
      {/* Navigation Controls */}
      <div className="navigation-buttons">
        <Button icon={<LeftOutlined />} />
        <Button icon={<RightOutlined />} />
      </div>
    </div>
  );
};

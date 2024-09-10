import React, { useEffect, useState } from "react";
import { Row, Col, Button, Typography, Select, Radio } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
const today = dayjs().tz("Europe/Berlin");

const { Title } = Typography;
const { Option } = Select;

const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const fullDays = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const timeslots = ["09:00 - 16:30", "13:00 - 20:30", "15:00 - 22:30"];

const months = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];

const getWeeksInMonth = (month: number, year: number) => {
  const startOfMonth = dayjs(`${year}-${month + 1}-01`)
    .tz("Europe/Berlin")
    .startOf("month")
    .startOf("isoWeek");
  const endOfMonth = dayjs(`${year}-${month + 1}-01`)
    .tz("Europe/Berlin")
    .endOf("month")
    .endOf("isoWeek");

  const totalWeeks = endOfMonth.diff(startOfMonth, "week") + 1;

  return totalWeeks;
};

const getCurrentWeekInMonth = (month: number, year: number) => {
  const startOfMonth = dayjs(`${year}-${month + 1}-01`)
    .startOf("month")
    .startOf("isoWeek");
  const currentWeek = today.diff(startOfMonth, "week") + 1;

  return currentWeek;
};

const getAdjacentMonths = (month: number, year: number) => {
  const prevMonth = dayjs(`${year}-${month + 1}-01`).subtract(1, "month");
  const nextMonth = dayjs(`${year}-${month + 1}-01`).add(1, "month");

  return {
    previous: {
      month: prevMonth.month(),
      year: prevMonth.year(),
    },
    current: {
      month: month,
      year: year,
    },
    next: {
      month: nextMonth.month(),
      year: nextMonth.year(),
    },
  };
};

const getAllWeeksInMonth = (selectedMonth: number, currentYear: number) => {
  const startOfMonth = dayjs(`${currentYear}-${selectedMonth + 1}-01`)
    .startOf("month")
    .startOf("isoWeek");
  const totalWeeks = getWeeksInMonth(selectedMonth, currentYear);

  const allWeeks = Array.from({ length: totalWeeks }).map((_, weekIndex) => {
    const startOfWeek = startOfMonth.add(weekIndex, "week");
    return Array.from({ length: 7 }).map((_, dayIndex) =>
      startOfWeek.add(dayIndex, "day")
    );
  });

  return allWeeks;
};

export const ScheduleGrid: React.FC = () => {
  // Use States and Variables-----------------------------------------
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const currentMonth = dayjs().month();
  const [viewType, setViewType] = useState("week");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const [allWeeks, setAllWeeks] = useState<Dayjs[][]>(
    getAllWeeksInMonth(selectedMonth, currentYear)
  );
  const [totalWeeks, setTotalWeeks] = useState(
    getWeeksInMonth(selectedMonth, currentYear)
  );
  const [currentWeek, setCurrentWeek] = useState(
    getCurrentWeekInMonth(selectedMonth, currentYear)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const monthsData = getAdjacentMonths(currentMonth, currentYear);
  const [disableTransition, setDisableTransition] = useState(false);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  // Helper Functions---------------------------------------------------

  const handleMouseEnter = (index: number) => {
    setHoveredDayIndex(index);
  };

  // Function to handle mouse leave
  const handleMouseLeave = () => {
    setHoveredDayIndex(null);
  };

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
    setDisableTransition(true);

    if (value === monthsData.previous.month) {
      const lastWeek = getWeeksInMonth(value, monthsData.previous.year);
      setCurrentWeek(lastWeek);
    } else if (value === monthsData.next.month) {
      setCurrentWeek(1);
    } else if (value === monthsData.current.month) {
      const currentWeekInMonth = getCurrentWeekInMonth(value, currentYear);
      setCurrentWeek(currentWeekInMonth);
    }
  };

  const handleWeekChange = (direction: string) => {
    if (isAnimating) return;
    setDisableTransition(false);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentWeek((prevWeek) => {
        if (direction === "left") return prevWeek > 1 ? prevWeek - 1 : prevWeek;
        if (direction === "right")
          return prevWeek < totalWeeks ? prevWeek + 1 : prevWeek;
        return prevWeek;
      });
      setIsAnimating(false);
    }, 0);
  };
  // UseEffect-----------------------------------------------------------
  useEffect(() => {
    const newTotalWeeks = getWeeksInMonth(selectedMonth, currentYear);
    setTotalWeeks(newTotalWeeks);

    setAllWeeks(getAllWeeksInMonth(selectedMonth, currentYear));
  }, [selectedMonth, currentYear]);

  const handleViewChange = (e: any) => {
    setViewType(e.target.value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render Mobile Schedule---------------------------------------------
  const renderMobile = () => (
    <div className="mobile-schedule">
      {/* Sticky Header */}
      <Row gutter={16} className="schedule-header-mobile">
        <Col>
          <Select
            style={{ width: 115 }}
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <Option
              key={monthsData.previous.month}
              value={monthsData.previous.month}
            >
              {months[monthsData.previous.month]} {monthsData.previous.year}
            </Option>
            <Option
              key={monthsData.current.month}
              value={monthsData.current.month}
            >
              {months[monthsData.current.month]} {monthsData.current.year}
            </Option>
            <Option key={monthsData.next.month} value={monthsData.next.month}>
              {months[monthsData.next.month]} {monthsData.next.year}
            </Option>
          </Select>
        </Col>
        <Col>
          <Radio.Group value={viewType} onChange={handleViewChange}>
            <Radio.Button value="week">Woche</Radio.Button>
            <Radio.Button value="month">Monat</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Scrollable Week Container */}
      <div className="week-container-mobile">
        {allWeeks[currentWeek - 1].map((date: Dayjs, index: number) => {
          const isToday = date.isSame(today, "day");
          const isLeakedDay = date.month() !== selectedMonth;

          return (
            <div key={index} className="mobile-day">
              {/* Row with day-date-container */}
              <Row gutter={16} align="middle">
                <Col span={24}>
                  <div className="day-date-container">
                    <span
                      className={
                        isLeakedDay
                          ? "leaked-day-span-mobile"
                          : "day-span-mobile"
                      }
                    >
                      {fullDays[(date.day() + 6) % 7]}
                    </span>
                    <span
                      className={
                        isLeakedDay
                          ? "leaked-date-span-mobile"
                          : "date-span-mobile"
                      }
                    >
                      {date.format("DD")}
                    </span>
                  </div>
                </Col>
              </Row>

              {/* Row with time slots */}
              <Row gutter={16} align="top">
                {timeslots.map((slot, timeIndex) => (
                  <Col
                    key={timeIndex}
                    span={24}
                    className="time-slot-container-mobile"
                  >
                    <div className="shift-timer-mobile">{slot}</div>
                    <div
                      className={`time-slot-mobile ${
                        isToday ? "current-slot-mobile" : ""
                      } ${isLeakedDay ? "leaked-day-mobile" : ""}`}
                    >
                      Slot {timeIndex + 1}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </div>
      <div className="footer-mobile">
        {/* Sticky Week Title */}
        <Title className="week-title-mobile" level={4}>
          Woche {currentWeek}
        </Title>

        {/* Sticky Navigation Buttons */}
        <div className="navigation-buttons-mobile">
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleWeekChange("left")}
            style={{ fontSize: "20px", padding: "10px 20px", height: "40px" }}
            disabled={currentWeek === 1}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => handleWeekChange("right")}
            style={{ fontSize: "20px", padding: "10px 20px", height: "40px" }}
            disabled={currentWeek === totalWeeks}
          />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return renderMobile();
  }

  // Render Desktop Schedule-----------------------------------------
  return (
    <div className="schedule-grid">
      {/* Header: Year, Month, View Type Switch */}
      <Row gutter={16} className="schedule-header">
        <Col>
          <Select
            style={{ width: 115 }}
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <Option
              key={monthsData.previous.month}
              value={monthsData.previous.month}
            >
              {months[monthsData.previous.month]} {monthsData.previous.year}
            </Option>
            <Option
              key={monthsData.current.month}
              value={monthsData.current.month}
            >
              {months[monthsData.current.month]} {monthsData.current.year}
            </Option>
            <Option key={monthsData.next.month} value={monthsData.next.month}>
              {months[monthsData.next.month]} {monthsData.next.year}
            </Option>
          </Select>
        </Col>
        <Col>
          <Radio.Group
            value={viewType}
            onChange={handleViewChange}
            style={{ marginLeft: "10px" }}
          >
            <Radio.Button value="week">Woche</Radio.Button>
            <Radio.Button value="month">Monat</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Time Slots Header */}
      <Row gutter={50} className="time-header">
        <Col span={2}></Col>
        {timeslots.map((slot) => (
          <Col span={7} key={slot}>
            <div>{slot}</div>
          </Col>
        ))}
      </Row>

      {/* Week Schedule */}
      <div
        className="weeks-container"
        style={{
          transform: `translateX(${-(currentWeek - 1) * 100}%)`,
          transition: disableTransition ? "none" : "transform 0.2s ease-in-out",
        }}
      >
        {allWeeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className={`schedule-content ${
              currentWeek === weekIndex + 1 ? "active" : ""
            }`}
          >
            {week.map((date: Dayjs, index: number) => {
              const isLeakedDay = date.month() !== selectedMonth;
              const isToday = date.isSame(today, "day");

              return (
                <Row gutter={50} key={index} className="main-schedule-row">
                  {/* Day Column */}
                  <Col
                    span={2}
                    className={`day-column ${
                      isLeakedDay
                        ? "leaked-day-column"
                        : isToday && hoveredDayIndex === index
                        ? "current-slot-hover"
                        : hoveredDayIndex === index
                        ? "hovered"
                        : ""
                    }`}
                  >
                    <div>
                      <span
                        className={
                          isLeakedDay ? "leaked-day-span-letter" : "day-span"
                        }
                      >
                        {days[index]}
                      </span>
                      <br />
                      <span
                        className={isLeakedDay ? "leaked-day-span-number" : ""}
                      >
                        {date.format("DD")}
                      </span>
                    </div>
                  </Col>

                  {/* Time Slots */}
                  {timeslots.map((_, timeIndex) => (
                    <Col
                      span={7}
                      key={timeIndex}
                      className={`time-slot ${
                        hoveredDayIndex === index && !isLeakedDay
                          ? "hovered"
                          : ""
                      } ${isLeakedDay ? "leaked-day" : ""} ${
                        isToday ? "current-slot" : ""
                      }`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                      Week {weekIndex + 1}, {days[index]}, Slot {timeIndex + 1}
                    </Col>
                  ))}
                </Row>
              );
            })}
          </div>
        ))}
      </div>

      <Title className="week-title" level={4}>
        Woche {currentWeek}
      </Title>

      {/* Navigation Controls */}
      <div className="navigation-buttons">
        <Button
          icon={<LeftOutlined />}
          onClick={() => handleWeekChange("left")}
          disabled={currentWeek === 1}
        />
        <Button
          icon={<RightOutlined />}
          onClick={() => handleWeekChange("right")}
          disabled={currentWeek === totalWeeks}
        />
      </div>
    </div>
  );
};

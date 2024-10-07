// CreateScheduleButton.tsx

import { useEffect, useState } from "react";
import { Button, Select, message, Modal } from "antd";
import { createScheduleHB } from "./HB-AutofillAlgorithm";
import { supabaseBrowserClient } from "@lib/supabase/client";
import React from "react";

const { Option } = Select;

interface MonthYear {
  month: number;
  year: number;
}

const CreateScheduleButton = () => {
  const [shops, setShops] = useState(["Hofbräuhaus"]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [availableMonths, setAvailableMonths] = useState<MonthYear[]>([]);
  const [noMonthsAvailable, setNoMonthsAvailable] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tempShop, setTempShop] = useState<string | null>(null);
  const [tempMonth, setTempMonth] = useState<number | null>(null);
  const [tempYear, setTempYear] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 900);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openCreateScheduleModal = () => {
    // Reset temporary selections when opening the modal
    setTempShop(null);
    setTempMonth(null);
    setTempYear(null);
    setSelectedShop(null);
    setAvailableMonths([]);
    setNoMonthsAvailable(false);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!tempShop || !tempMonth || !tempYear) {
      message.error(
        "Bitte wählen Sie sowohl das Geschäft als auch den Monat aus"
      );
      return;
    }

    if (tempShop === "Hofbräuhaus") {
      await createScheduleHB(tempShop, tempMonth, tempYear);
    } else {
      // Implement other shops as needed
    }

    // Close the modal after creating the schedule
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchAvailableMonths = async (shopName: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const currentYear = currentDate.getFullYear();
    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    // Adjust the table name and query according to your database schema
    const tableName =
      shopName === "Hofbräuhaus" ? "schedules_hb" : "schedules_other"; // Adjust as needed

    // Check if schedules exist for current and next month
    const { data, error } = await supabaseBrowserClient
      .from(tableName)
      .select("month, year")
      .or(
        `and(month.eq.${currentMonth},year.eq.${currentYear}),and(month.eq.${nextMonth},year.eq.${nextMonthYear})`
      );

    if (error) {
      console.error("Error fetching schedules:", error);
      message.error("Fehler beim Abrufen der verfügbaren Monate");
      return;
    }

    const monthsWithSchedules =
      data?.map((schedule) => ({
        month: schedule.month,
        year: schedule.year,
      })) || [];

    const available: MonthYear[] = [];

    // Check current month
    if (
      !monthsWithSchedules.find(
        (m) => m.month === currentMonth && m.year === currentYear
      )
    ) {
      available.push({ month: currentMonth, year: currentYear });
    }

    // Check next month
    if (
      !monthsWithSchedules.find(
        (m) => m.month === nextMonth && m.year === nextMonthYear
      )
    ) {
      available.push({ month: nextMonth, year: nextMonthYear });
    }

    if (available.length === 0) {
      setNoMonthsAvailable(true);
      setAvailableMonths([]);
    } else {
      setAvailableMonths(available);
      setNoMonthsAvailable(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={openCreateScheduleModal}
        style={{
          padding: "18px 20px",
          fontSize: "17px",
        }}
        className="responsive-button"
      >
        Neuen Dienstplan erstellen
      </Button>

      <Modal
        title="Neuen Dienstplan erstellen"
        open={isModalVisible} // Use 'open' instead of 'visible'
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Erstellen"
        cancelText="Abbrechen"
        centered={isMobile}
      >
        <Select
          style={{ width: "100%", marginBottom: 16 }}
          placeholder="Shop auswählen"
          value={tempShop}
          onChange={async (value) => {
            setTempShop(value);
            setSelectedShop(value);
            setTempMonth(null);
            setTempYear(null);

            // Fetch available months for the selected shop
            await fetchAvailableMonths(value);
          }}
        >
          {shops.map((shop) => (
            <Option key={shop} value={shop}>
              {shop}
            </Option>
          ))}
        </Select>

        {selectedShop && availableMonths.length > 0 && (
          <Select
            style={{ width: "100%" }}
            placeholder="Monat auswählen"
            value={
              tempMonth && tempYear ? `${tempMonth}-${tempYear}` : undefined
            }
            onChange={(value) => {
              const [selectedMonth, selectedYear] = value.split("-");
              setTempMonth(parseInt(selectedMonth, 10));
              setTempYear(parseInt(selectedYear, 10));
            }}
          >
            {availableMonths.map((monthYear) => (
              <Option
                key={`${monthYear.month}-${monthYear.year}`}
                value={`${monthYear.month}-${monthYear.year}`}
              >
                {new Date(
                  monthYear.year,
                  monthYear.month - 1
                ).toLocaleString("de-DE", {
                  month: "long",
                  year: "numeric",
                })}
              </Option>
            ))}
          </Select>
        )}

        {selectedShop && noMonthsAvailable && (
          <div style={{ marginTop: 16, color: "red" }}>
            Kein Monat verfügbar
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateScheduleButton;

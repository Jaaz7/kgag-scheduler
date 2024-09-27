import { useEffect, useState } from "react";
import { Button, Select, message } from "antd";
import { createScheduleHB } from "./HB-AutofillAlgorithm";
import React from "react";
import { useModal } from "@contexts/ModalProvider";

const { Option } = Select;

const CreateScheduleButtonHB = () => {
  const { showModal } = useModal();

  // Hardcoded list of shops
  const shops = ["Hofbräuhaus"];

  const openCreateScheduleModal = () => {
    let tempShop: string | null = null;
    let tempMonth: number | null = null;
    const currentMonth = new Date().getMonth() + 1;

    // Modal setup
    showModal({
      title: "Neuen Dienstplan erstellen",
      content: (
        <>
          <Select
            style={{ width: "100%", marginBottom: 16 }}
            placeholder="Shop auswählen"
            onChange={(value) => {
              console.log("Shop selected:", value); // Debug log
              tempShop = value; // Update tempShop instead of state
            }}
          >
            {shops.map((shop) => (
              <Option key={shop} value={shop}>
                {shop}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: "100%" }}
            placeholder="Monat auswählen"
            onChange={(value) => {
              console.log("Month selected:", value); // Debug log
              tempMonth = value; // Update tempMonth instead of state
            }}
          >
            <Option value={currentMonth}>
              {new Date().toLocaleString("de-DE", {
                month: "long",
                year: "numeric",
              })}
            </Option>
            <Option value={currentMonth + 1}>
              {new Date(new Date().setMonth(currentMonth)).toLocaleString(
                "de-DE",
                { month: "long", year: "numeric" }
              )}
            </Option>
          </Select>
        </>
      ),
      onOk: async () => {
        console.log("Selected shop in handleCreate:", tempShop);
        console.log("Selected month in handleCreate:", tempMonth);

        if (!tempShop || !tempMonth) {
          message.error(
            "Bitte wählen Sie sowohl das Geschäft als auch den Monat aus"
          );
          return;
        }

        const currentYear = new Date().getFullYear();
        await createScheduleHB(tempShop, tempMonth, currentYear);
      },
      okText: "Erstellen",
      cancelText: "Abbrechen",
    });
  };
  return (
    <>
      <Button
        type="primary"
        onClick={openCreateScheduleModal}
        style={{
          padding: "18px 20px", // Default button size
          fontSize: "17px", // Default font size
        }}
        className="responsive-button"
      >
        Neuen Dienstplan erstellen
      </Button>
    </>
  );
};
export default CreateScheduleButtonHB;

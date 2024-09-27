import React, { useState, useEffect } from "react";
import { supabaseBrowserClient } from "@lib/supabase/client";
import { message } from "antd";

// Define the structure for a Worker
interface Worker {
  id: string;
  name: string;
  work_days_per_week: number;
  shift_preference: string[];
  day_preferences: string[];
}

// Define the structure for a Shift
interface Shift {
  name: string;
  time: string;
}

// Shift slots for each day
const shifts: Shift[] = [
  { name: "morning", time: "9 - 16:30" },
  { name: "middle", time: "13 - 20:30" },
  { name: "late", time: "15 - 22:30" },
];

// Days of the week
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Define the structure of a schedule entry
interface ScheduleEntry {
  schedule_id: string;
  date: string;
  shift_type: string;
  start_time: string;
  end_time: string;
}

// Step 1: Create a schedule if it doesn't exist, and autofill shifts
export const createScheduleHB = async (
  shopName: string,
  month: number,
  year: number
): Promise<void> => {
  try {
    // Check if a schedule already exists
    const { data, error } = await supabaseBrowserClient
      .from("schedules_hb") // Updated table name
      .select("id")
      .eq("month", month)
      .eq("year", year);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error("Error checking the schedule");
    }

    if (data && data.length > 0) {
      message.warning("A schedule for this shop and month already exists.");
      return;
    }

    // Create a new schedule
    const { data: newSchedule, error: insertError } =
      await supabaseBrowserClient
        .from("schedules_hb") // Updated table name
        .insert([{ shop_name: shopName, month, year }])
        .select();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      throw new Error("Error creating the schedule");
    }

    message.success("New schedule created successfully!");

    // Call the Autofill function
    if (newSchedule && newSchedule.length > 0) {
      await autofillSchedule(newSchedule[0].id, month, year);
    }
  } catch (err) {
    if (err instanceof Error) {
      message.error(err.message || "An unexpected error occurred");
    } else {
      message.error("An unexpected error occurred");
    }
  }
};

// Step 2: Autofill the schedule with workers from the database
export const autofillSchedule = async (
  scheduleId: string,
  month: number,
  year: number
) => {
  try {
    // Fetch workers from the database
    const { data: workers, error: workersError } = await supabaseBrowserClient
      .from("profiles")
      .select(
        "id, name, work_days_per_week, shift_preference, day_preferences"
      );

    if (workersError) {
      console.error("Error fetching workers:", workersError);
      throw new Error("Error fetching workers");
    }

    if (!workers || workers.length === 0) {
      message.warning("No workers available for scheduling.");
      return;
    }

    // Explicitly type the array as ScheduleEntry[]
    const scheduleEntries: ScheduleEntry[] = [];

    days.forEach((day, dayIndex) => {
      shifts.forEach((shift) => {
        const workerIndex = dayIndex % workers.length; // Simple round-robin for now
        const worker = workers[workerIndex];

        // Create a new shift entry for each day and shift
        scheduleEntries.push({
          schedule_id: scheduleId,
          date: `${year}-${month}-${dayIndex + 1}`, // Simplified date for the day
          shift_type: shift.name,
          start_time: shift.time.split(" - ")[0],
          end_time: shift.time.split(" - ")[1],
        });
      });
    });

    // Insert the schedule entries into the database
    const { error: entriesError } = await supabaseBrowserClient
      .from("schedules_entries_hb") // Updated table name
      .insert(scheduleEntries);

    if (entriesError) {
      console.error("Error inserting schedule entries:", entriesError);
      throw new Error("Error inserting schedule entries");
    }

    message.success("Autofill completed successfully!");
  } catch (err) {
    if (err instanceof Error) {
      message.error(err.message || "An unexpected error occurred");
    } else {
      message.error("An unexpected error occurred");
    }
  }
};

// React Component to Display the Autofill Algorithm
const AutofillAlgorithm: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [schedule, setSchedule] = useState<any>({});

  useEffect(() => {
    // Fetch the workers on component load
    const fetchWorkers = async () => {
      try {
        const { data: workersData, error } = await supabaseBrowserClient
          .from("profiles")
          .select(
            "id, name, work_days_per_week, shift_preference, day_preferences"
          );

        if (error) {
          console.error("Error fetching workers:", error);
          throw new Error("Error fetching workers");
        }

        setWorkers(workersData || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkers();
  }, []);

  const handleFillSchedule = async () => {
    const shopName = "Hofbräuhaus"; // Example shop name, replace as needed
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    await createScheduleHB(shopName, currentMonth, currentYear);
  };

  return (
    <div>
      <h2>Autofill Work Schedule</h2>
      <button onClick={handleFillSchedule}>Autofill Schedule</button>

      {/* Display Workers */}
      <div>
        <h3>Workers:</h3>
        <ul>
          {workers.map((worker) => (
            <li key={worker.id}>{worker.name}</li>
          ))}
        </ul>
      </div>

      {/* Display Schedule (Placeholder for now) */}
      <div>
        <h3>Schedule:</h3>
        {days.map((day) => (
          <div key={day}>
            <h4>{day}</h4>
            {shifts.map((shift) => (
              <div key={shift.name}>
                <strong>{shift.time}: </strong>
                {/* Placeholder worker assignment */}
                <span>Worker assigned to {shift.name} shift</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutofillAlgorithm;

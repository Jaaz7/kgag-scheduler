import { supabaseBrowserClient } from "@lib/supabase/client";
import { message } from "antd";

const SCHEDULE_ID_HB_SHOP = "hb-shop";

// Define the structure for a Worker
interface Worker {
  id: string;
  name: string;
  schedule_id: string | null;
  work_days_per_week: number;
  shift_preference: string[];
  day_preferences: string[];
}

// Fetch all workers and print their schedule_id
export const createScheduleHB = async (
  shopName: string,
  month: number,
  year: number
): Promise<void> => {
  try {
    // Fetch all profiles without any filter
    const { data: workers, error: workersError } = await supabaseBrowserClient
      .from("profiles")
      .select(
        "id, name, schedule_id, work_days_per_week, shift_preference, day_preferences"
      );

    if (workersError) {
      console.error("Error fetching workers:", workersError);
      throw new Error("Error fetching workers");
    }

    if (!workers || workers.length === 0) {
      message.warning("Keine Mitarbeiter für die Planung verfügbar.");
      return;
    }

    // Print the names and schedule_id of the workers to the console
    console.log("Worker names and schedule_id:");
    workers.forEach((worker) => {
      console.log(
        `Name: ${worker.name}, schedule_id: '${worker.schedule_id}'`
      );
    });

    // Proceed to next steps (we'll add them later)
  } catch (err) {
    if (err instanceof Error) {
      message.error(err.message || "Ein unerwarteter Fehler ist aufgetreten");
    } else {
      message.error("Ein unerwarteter Fehler ist aufgetreten");
    }
  }
};

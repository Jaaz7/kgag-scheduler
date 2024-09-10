"use client";

import { useEffect } from "react";

export default function ViewportHeightSetter() {
  useEffect(() => {
    // Function to calculate the viewport height and set it to --vh
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initial calculation
    setVh();

    // Recalculate on resize
    window.addEventListener("resize", setVh);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return null; // This component does not render anything visible
}

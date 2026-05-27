import { useState, useEffect } from "react";
import { EventBus } from "../../infrastructure/events/EventBus";

export function useGameTime() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState<
    "pagi" | "siang" | "sore" | "malam"
  >("pagi");

  useEffect(() => {
    const onTimeUpdated = ({
      time,
      date,
      period,
    }: {
      time: string;
      date: string;
      period: "pagi" | "siang" | "sore" | "malam";
    }) => {
      setCurrentTime(time);
      setCurrentDate(date);
      setCurrentPeriod(period);
    };

    EventBus.on("time_updated", onTimeUpdated);

    return () => {
      EventBus.off("time_updated", onTimeUpdated);
    };
  }, []);

  return { currentTime, currentDate, currentPeriod };
}

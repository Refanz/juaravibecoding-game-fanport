import { useEffect, useState, useRef } from "react";
import { EventBus } from "../../infrastructure/events/EventBus";
import { FloorManager } from "../../domain/FloorManager";
import { HOSPITAL_QUIZZES } from "../../infrastructure/data/quizzes";
import { nanoid } from 'nanoid';

export function useTicketManager(floorManager: FloorManager) {
  const [ticketNotification, setTicketNotification] = useState<{ 
    title: string; 
    message: string;
    icon?: string;
    colorTheme?: "orange" | "red" | "blue" | "green";
  } | null>(null);
  const lastSpawnHour = useRef<number | null>(null);
  const currentTimestamp = useRef<number>(0);
  
  useEffect(() => {
    let initialSpawnDone = false;

    const onTimeUpdated = (data: any) => {
      if (data.timestamp) currentTimestamp.current = data.timestamp;
      
      if (!initialSpawnDone && currentTimestamp.current > 0) {
        initialSpawnDone = true;
        const activeCount = floorManager.allObjects.filter(o => o.active && !o.solved).length;
        if (activeCount === 0) {
          const inactiveObjects = floorManager.allObjects.filter(o => !o.active || o.solved);
          if (inactiveObjects.length > 0) {
            const obj = inactiveObjects[Math.floor(Math.random() * inactiveObjects.length)];
            obj.active = true;
            obj.solved = false;
            obj.completionTime = null;
            obj.id = `TKT-${nanoid(6).toUpperCase()}`;
            obj.spawnTime = currentTimestamp.current;
            EventBus.emit("ticket_spawned");
            const quiz = HOSPITAL_QUIZZES[obj.quizIndex % HOSPITAL_QUIZZES.length];
            
            let colorTheme: "orange" | "red" | "blue" | "green" = "blue";
            let icon = "ℹ️";
            if (obj.impact === "High") {
              colorTheme = "red";
              icon = "🚨";
            } else if (obj.impact === "Medium") {
              colorTheme = "orange";
              icon = "⚠️";
            }
            
            setTimeout(() => {
              setTicketNotification({
                title: `Laporan Insiden: ${obj.impact}`,
                message: `Tiket Baru: [${quiz.title}] di ${obj.label} (Lt. ${obj.floor})`,
                icon,
                colorTheme
              });
            }, 1000);
          }
        }
      }
    };
    EventBus.on("time_updated", onTimeUpdated);

    const onHourChanged = (hour: number) => {
      // Interval spawn 1-2 hours
      if (lastSpawnHour.current === null) {
        lastSpawnHour.current = hour;
      }
      
      const diff = hour - lastSpawnHour.current;
      // if hour wrapped around (e.g. 20 -> 8), diff is negative, just reset
      if (diff < 0) {
        lastSpawnHour.current = hour;
        return;
      }
      
      const shouldSpawn = diff >= (Math.floor(Math.random() * 2) + 1); // 1 or 2 hours
      
      if (shouldSpawn) {
        // Spawn ticket
        const inactiveObjects = floorManager.allObjects.filter(o => !o.active || o.solved);
        if (inactiveObjects.length > 0) {
          // Pick a random one
          const obj = inactiveObjects[Math.floor(Math.random() * inactiveObjects.length)];
          obj.active = true;
          obj.solved = false;
          obj.completionTime = null;
          obj.id = `TKT-${nanoid(6).toUpperCase()}`;
          obj.spawnTime = currentTimestamp.current;
          
          const quiz = HOSPITAL_QUIZZES[obj.quizIndex % HOSPITAL_QUIZZES.length];
          
          let colorTheme: "orange" | "red" | "blue" | "green" = "blue";
          let icon = "ℹ️";
          if (obj.impact === "High") {
            colorTheme = "red";
            icon = "🚨";
          } else if (obj.impact === "Medium") {
            colorTheme = "orange";
            icon = "⚠️";
          }
          
          setTicketNotification({
            title: `Laporan Insiden: ${obj.impact}`,
            message: `Tiket Baru: [${quiz.title}] di ${obj.label} (Lt. ${obj.floor})`,
            icon,
            colorTheme
          });
          
          lastSpawnHour.current = hour;
          EventBus.emit("ticket_spawned"); // UI can refresh
        }
      }
    };
    
    const onEndOfDay = (data: { dateStr: string }) => {
      const activeTickets = floorManager.allObjects.filter(o => o.active);
      const resolved = activeTickets.filter(o => o.solved);
      const unresolved = activeTickets.filter(o => !o.solved);

      const details = activeTickets.map(o => {
        const quiz = HOSPITAL_QUIZZES[o.quizIndex % HOSPITAL_QUIZZES.length];
        let resolveTimeHours = null;
        if (o.solved && o.completionTime && o.spawnTime) {
          resolveTimeHours = (o.completionTime - o.spawnTime) / (1000 * 60 * 60);
        }
        return {
          id: o.id,
          title: quiz.title,
          label: o.label,
          floor: o.floor,
          impact: o.impact,
          urgency: o.urgency,
          solved: o.solved,
          resolveTimeHours
        };
      });

      const report = {
        id: `RPT-${nanoid(8).toUpperCase()}`,
        date: data.dateStr,
        totalResolved: resolved.length,
        totalUnresolved: unresolved.length,
        details
      };

      const existingStr = sessionStorage.getItem("hospital_reports");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.push(report);
      sessionStorage.setItem("hospital_reports", JSON.stringify(existing));

      EventBus.emit("show_daily_report", report);
    };

    EventBus.on("hour_changed", onHourChanged);
    EventBus.on("end_of_day", onEndOfDay);
    return () => {
      EventBus.off("hour_changed", onHourChanged);
      EventBus.off("time_updated", onTimeUpdated);
      EventBus.off("end_of_day", onEndOfDay);
    };
  }, [floorManager]);

  return { ticketNotification, setTicketNotification };
}

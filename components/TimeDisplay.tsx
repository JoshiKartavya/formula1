"use client";

import { useEffect, useState } from "react";

export default function TimeDisplay({ trackGmtOffset }: { trackGmtOffset: number }) {
  const [myTime, setMyTime] = useState("");
  const [trackTime, setTrackTime] = useState("");

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      // My Time (IST: UTC + 5:30)
      const optionsIst: Intl.DateTimeFormatOptions = { 
        timeZone: "Asia/Kolkata", 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      };
      setMyTime(now.toLocaleTimeString('en-IN', optionsIst));

      // Track Time
      const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
      const trackNow = new Date(utcNow + (3600000 * trackGmtOffset));
      setTrackTime(
        trackNow.getHours().toString().padStart(2, '0') + ':' + 
        trackNow.getMinutes().toString().padStart(2, '0')
      );
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [trackGmtOffset]);

  return (
    <div className="flex flex-col justify-center min-w-[120px]">
      <div className="flex justify-between items-center gap-4">
        <span className="text-text-white font-medium">My Time</span>
        <span className="text-text-white font-bold">{myTime || "--:--"}</span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <span className="text-text-grey text-sm">Track Time</span>
        <span className="text-text-grey text-sm">{trackTime || "--:--"}</span>
      </div>
    </div>
  );
}

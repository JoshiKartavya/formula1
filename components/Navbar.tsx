"use client";

import Image from "next/image";
import TimeDisplay from "./TimeDisplay";
import { fetchOpenF1 } from "../lib/openf1";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar({ showLapInfo }: { showLapInfo?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [trackGmtOffset, setTrackGmtOffset] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const loadTrackTime = async () => {
      try {
        const sessions = await fetchOpenF1("sessions", { session_key: "latest" });
        if (sessions && sessions.length > 0 && isMounted) {
          const offsetStr = sessions[0].gmt_offset; // "02:00:00"
          if (offsetStr) {
            const parts = offsetStr.split(":");
            const sign = parts[0].startsWith("-") ? -1 : 1;
            const hours = parseInt(parts[0].replace(/[-+]/, ""), 10);
            const mins = parseInt(parts[1], 10);
            setTrackGmtOffset(sign * (hours + mins / 60));
          }
        }
      } catch (e) {
        console.error("Failed to fetch session for track time", e);
      }
    };

    loadTrackTime();
    return () => { isMounted = false };
  }, []);

  return (
    <>
      {/* Spacer to maintain document flow since Navbar is fixed */}
      <div className="h-[9.5rem] w-full shrink-0" aria-hidden="true" />
      
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 z-50 w-full px-6 pt-6 pb-2 pointer-events-none">
        <nav className="glass-panel flex h-[7.5rem] px-[5rem] justify-between items-center pointer-events-auto">
        
        {/* Left Side: F1 Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
          <Image 
            src="/Icons/f1.svg" 
            alt="F1 Logo" 
            width={130} 
            height={32} 
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Center: Dynamic Page Info */}
        <div className="text-center whitespace-nowrap absolute left-1/2 -translate-x-1/2">
          {pathname === '/race' && (
            <div className="text-[40px]">
              <span className="text-[#818181] font-light">Lap</span>{' '}
              <span className="text-white font-bold">40</span>{' '}
              <span className="text-[#818181] font-light">Out of</span>{' '}
              <span className="text-white font-bold">56</span>
            </div>
          )}
          {pathname === '/standings' && (
            <div className="text-[28px] md:text-[32px] font-extrabold uppercase tracking-wide text-white font-f1">
              2026 DRIVERS&apos; STANDINGS
            </div>
          )}
        </div>

        {/* Right Side: TAG Heuer & Timing */}
        <div className="flex items-center gap-6">
          <Image 
            src="/Logos/tag.png" 
            alt="TAG Heuer Logo" 
            width={56} 
            height={56} 
            className="h-14 w-auto object-contain"
          />
          
          <TimeDisplay trackGmtOffset={trackGmtOffset} />
          
          <div className="ml-2">
            <Image 
              src="/Logos/Clock.png" 
              alt="Clock Face" 
              width={56} 
              height={56} 
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>
        
      </nav>
    </div>
    </>
  );
}


import { fetchOpenF1 } from "../lib/openf1";
import Image from "next/image";
import Link from "next/link";

export default async function DriverStanding({ variant = "compact" }: { variant?: "compact" | "full" }) {
  let mergedStandings: any[] = [];

  try {
    const sessionKey = "latest";

    // Fetch both endpoints in parallel using Promise.allSettled so one failing doesn't break the other
    const [championshipRes, driversRes] = await Promise.allSettled([
      fetchOpenF1("championship_drivers", { session_key: sessionKey }),
      fetchOpenF1("drivers", { session_key: sessionKey })
    ]);

    const championshipData = championshipRes.status === "fulfilled" ? championshipRes.value : [];
    const driversData = driversRes.status === "fulfilled" ? driversRes.value : [];

    // Create a map for quick driver info lookup
    const driverDetailsMap = new Map();
    if (Array.isArray(driversData)) {
      driversData.forEach((d: any) => {
        driverDetailsMap.set(d.driver_number, d);
      });
    }

    if (Array.isArray(championshipData) && championshipData.length > 0) {
      // Merge data
      mergedStandings = championshipData.map((standing: any) => {
        const details = driverDetailsMap.get(standing.driver_number) || {};
        return {
          ...standing,
          full_name: details.full_name || `Driver ${standing.driver_number}`,
          team_name: details.team_name || "Unknown Team",
          team_colour: details.team_colour || "ffffff",
          country_code: details.country_code || "",
          headshot_url: details.headshot_url || "",
        };
      });

      // Sort by championship position
      mergedStandings.sort((a, b) => a.position_current - b.position_current);
    } else {
      // Fallback: If championship_drivers returns 404/empty, just show the driver list
      mergedStandings = Array.isArray(driversData) ? driversData.map((d: any, index: number) => ({
        ...d,
        position_current: index + 1, // Fallback position
        points_current: 0,
        full_name: d.full_name || `Driver ${d.driver_number}`,
        team_name: d.team_name || "Unknown Team",
        team_colour: d.team_colour || "ffffff",
        country_code: d.country_code || "",
        headshot_url: d.headshot_url || "",
      })) : [];
    }

  } catch (error) {
    console.error("Failed to load standings:", error);
  }

  if (variant === "full") {
    return (
      <div className="w-full text-white">
        <div className="glass-panel p-6 rounded-[20px] w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-[11px] font-semibold text-[#818181] uppercase tracking-widest">
                <th className="py-4 px-4 font-normal whitespace-nowrap w-24">Pos.</th>
                <th className="py-4 px-4 font-normal whitespace-nowrap">Driver</th>
                <th className="py-4 px-4 font-normal whitespace-nowrap w-40">Nationality</th>
                <th className="py-4 px-4 font-normal whitespace-nowrap">Team</th>
                <th className="py-4 px-4 text-right font-normal whitespace-nowrap w-24">Pts.</th>
              </tr>
            </thead>
            <tbody>
              {mergedStandings && mergedStandings.length > 0 ? (
                mergedStandings.map((driver: any, idx: number) => {
                  const parts = driver.full_name ? driver.full_name.split(' ') : [];
                  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : driver.full_name || "Unknown";
                  const firstName = parts.length > 1 ? parts[0] : "";
                  
                  return (
                    <tr key={driver.driver_number} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-5 px-4 text-sm font-bold">{driver.position_current || idx + 1}</td>
                      <td className="py-5 px-4 flex items-center gap-3">
                        <Link href={`/driver/${driver.driver_number}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 overflow-hidden shrink-0 relative">
                            {driver.headshot_url ? (
                              <img src={driver.headshot_url.replace('http:', 'https:')} alt={driver.full_name} className="object-cover w-full h-full" />
                            ) : (
                              <span className="text-[10px]">{driver.full_name?.charAt(0) || "U"}</span>
                            )}
                          </div>
                          <span className="text-sm whitespace-nowrap font-medium text-[#818181] hover:text-white transition-colors">
                            {firstName} <span className="font-bold text-white">{lastName}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="py-5 px-4 text-sm font-bold">{driver.country_code || "UNK"}</td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: `#${driver.team_colour || "ffffff"}` }}></div>
                          <span className="text-sm font-bold whitespace-nowrap">{driver.team_name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 text-right text-sm font-bold">{driver.points_current !== undefined ? driver.points_current : 0}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-secondary-red">Loading or no data available...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Compact variant for sidebar
  return (
    <div className="glass-panel flex flex-col items-start p-6 h-[37.625rem] w-[325px] gap-2.5 overflow-hidden">
      <h2 className="text-xl font-bold mb-4 w-full text-center text-text-white">Driver Standings</h2>
      <ul className="text-text-white w-full space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {mergedStandings && mergedStandings.length > 0 ? (
          mergedStandings.map((driver: any, idx: number) => {
            const parts = driver.full_name ? driver.full_name.split(' ') : [];
            const lastName = parts.length > 1 ? parts[parts.length - 1] : driver.full_name || "Unk";
            const abbrev = lastName.substring(0, 3).charAt(0).toUpperCase() + lastName.substring(1, 3).toLowerCase();
            const initial = lastName.charAt(0).toUpperCase();

            return (
              <li key={driver.driver_number} className="flex items-center w-full pb-2">
                <span className="w-6 font-medium">{driver.position_current || idx + 1}</span>
                <div className="w-8 h-8 mx-3 rounded-full border border-white/20 flex items-center justify-center bg-white/5 overflow-hidden relative shrink-0">
                  {driver.headshot_url ? (
                    <img src={driver.headshot_url.replace('http:', 'https:')} alt={driver.full_name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-[10px]">{initial}</span>
                  )}
                </div>
                <span className="w-12 font-medium">{abbrev}</span>
                <span className="w-6 text-center">{initial}</span>
                <span className="ml-auto text-sm">{driver.points_current !== undefined ? driver.points_current : 0}</span>
              </li>
            );
          })
        ) : (
          <li className="text-secondary-red">Loading or no data available...</li>
        )}
      </ul>
    </div>
  );
}
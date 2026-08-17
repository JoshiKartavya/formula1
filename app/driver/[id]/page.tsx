import { fetchOpenF1 } from "@/lib/openf1";
import Navbar from "@/components/Navbar";
import AiBar from "@/components/AiBar";

export default async function DriverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch driver data and championship standing
  const [driversRes, championshipRes] = await Promise.allSettled([
    fetchOpenF1("drivers", { session_key: "latest", driver_number: id }),
    fetchOpenF1("championship_drivers", { session_key: "latest", driver_number: id })
  ]);

  const driverData = driversRes.status === "fulfilled" && driversRes.value.length > 0 ? driversRes.value[0] : null;
  const championshipData = championshipRes.status === "fulfilled" && championshipRes.value.length > 0 ? championshipRes.value[0] : null;

  if (!driverData) {
    return (
      <main className="h-max relative overflow-hidden bg-black text-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-secondary-red">Driver not found</h1>
        </div>
        <AiBar />
      </main>
    );
  }

  const teamColor = driverData.team_colour ? `#${driverData.team_colour}` : "#ffffff";

  return (
    <main className="h-max relative overflow-hidden bg-black text-white">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 pb-32">
          
          <div className="glass-panel p-10 flex flex-col md:flex-row gap-10 items-center md:items-start rounded-[20px] overflow-hidden relative border-t-4">
            {/* Driver Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white/10 flex items-center justify-center bg-white/5 overflow-hidden shrink-0 relative shadow-2xl z-10">
              {driverData.headshot_url ? (
                <img src={driverData.headshot_url.replace('http:', 'https:')} alt={driverData.full_name} className="object-cover w-full h-full" />
              ) : (
                <span className="text-5xl font-bold text-white/50">{driverData.name_acronym || driverData.full_name?.charAt(0)}</span>
              )}
            </div>

            {/* Driver Info */}
            <div className="flex flex-col flex-1 z-10 w-full mt-4 md:mt-0">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 font-f1 italic">
                  {driverData.driver_number}
                </span>
                <div className="h-12 w-[2px] bg-white/20 rounded-full" />
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  {driverData.full_name}
                </h1>
              </div>

              <div className="flex items-center gap-3 mt-4 text-xl md:text-2xl font-light text-gray-300">
                <div className="w-5 h-5 rounded-full shadow-lg" style={{ backgroundColor: teamColor }}></div>
                <span className="font-semibold text-white">{driverData.team_name}</span>
                <span className="opacity-50 mx-2">•</span>
                <span>{driverData.country_code}</span>
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col gap-2">
                  <span className="text-[#818181] uppercase tracking-widest text-xs font-semibold">Championship Pos</span>
                  <span className="text-4xl font-bold text-white">{championshipData?.position_current || "-"}</span>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col gap-2">
                  <span className="text-[#818181] uppercase tracking-widest text-xs font-semibold">Total Points</span>
                  <span className="text-4xl font-bold text-white">{championshipData?.points_current || "0"}</span>
                </div>
                {/* Additional placeholders for more data later */}
              </div>
            </div>
            
            {/* Huge background number */}
            <div className="absolute -right-10 -bottom-20 text-[200px] md:text-[300px] font-f1 italic font-black text-white/[0.03] pointer-events-none select-none z-0">
              {driverData.driver_number}
            </div>
          </div>

        </div>

        <AiBar />
      </div>
    </main>
  );
}

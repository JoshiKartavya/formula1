import Navbar from "@/components/Navbar";
import AiBar from "@/components/AiBar";
import DriverStanding from "@/components/DriverStanding";

export default function StandingsPage() {
  return (
    <main className="h-max relative overflow-hidden bg-black text-white">

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar showLapInfo={false} />

        {/* Content Area */}
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 pb-32">
          <DriverStanding variant="full" />
        </div>

        {/* AI Bar at the bottom */}
        <AiBar />
      </div>
    </main>
  );
}

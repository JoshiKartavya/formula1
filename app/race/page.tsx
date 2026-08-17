import Navbar from "../../components/Navbar";
import DriverStanding from "../../components/DriverStanding";
import AiBar from "../../components/AiBar";
import RadioMessage from "../../components/RadioMessage";

export default function Race() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-40">
      <Navbar showLapInfo={true} />
      
      <main className="flex-1 py-6 pl-[80px] pr-6 flex flex-col lg:flex-row gap-6 w-full">
        {/* Sidebar */}
        <aside className="w-auto flex flex-col gap-6 flex-shrink-0">
          <DriverStanding />
        </aside>
        
        {/* Main Content Area */}
        <section className="w-full relative flex-1 min-h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <img src="/c78cd46e5b2be67ace3779b97c802a903237fa90.svg" alt="Track Map" className="w-full max-w-[971px] max-h-[604px] object-contain opacity-80" />
          </div>
          
          {/* Radio Message Widget at bottom right */}
          <div className="absolute bottom-10 right-10 z-10">
            <RadioMessage />
          </div>
        </section>
      </main>

      {/* AI Bar sticky at the bottom */}
      <AiBar />
    </div>
  );
}

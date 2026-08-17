import Navbar from "../components/Navbar";
import AiBar from "../components/AiBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-40">
      <Navbar />
      
      <main className="flex-1">
        {/* Home page content goes here */}
      </main>

      {/* AI Bar sticky at the bottom */}
      <AiBar />
    </div>
  );
}

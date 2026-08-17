"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const AVAILABLE_PAGES = [
  { name: "Home", path: "/" },
  { name: "Race", path: "/race" },
  { name: "Standings", path: "/standings" },
];

export default function AiBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<typeof AVAILABLE_PAGES>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    
    if (val.trim() === "") {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = AVAILABLE_PAGES.filter(page => 
      page.name.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        navigateTo(suggestions[selectedIndex].path);
      } else {
        // If nothing selected, just take the top match if available
        navigateTo(suggestions[0].path);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const navigateTo = (path: string) => {
    setInput("");
    setSuggestions([]);
    setSelectedIndex(-1);
    router.push(path);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full px-6 pt-2 pb-6 pointer-events-none flex flex-col items-center">
      
      {/* Suggestions Dropdown (appears above the AiBar) */}
      {suggestions.length > 0 && (
        <div className="w-full max-w-[800px] mb-4 pointer-events-auto">
          <div className="glass-panel py-2 px-2 flex flex-col gap-1 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {suggestions.map((suggestion, index) => (
              <div 
                key={suggestion.path}
                className={`px-6 py-4 cursor-pointer rounded-xl flex items-center justify-between transition-colors ${index === selectedIndex ? 'bg-white/20' : 'hover:bg-white/10'}`}
                onClick={() => navigateTo(suggestion.path)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/50 font-mono text-sm">/</span>
                  <span className="text-white text-xl font-medium tracking-wide">{suggestion.name}</span>
                </div>
                <span className="text-white/30 text-sm font-mono tracking-widest uppercase">Go to page</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className="glass-panel flex w-full h-[7.5rem] px-[5rem] justify-between items-center pointer-events-auto cursor-text shadow-2xl"
        onClick={handleContainerClick}
      >
        
        {/* Left Side: Slash Command Indicator & Input */}
        <div className="flex items-center flex-1 h-full gap-2 relative">
          <div className="text-text-white/70 text-3xl font-light font-mono">
            /
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search for a page..."
            className="flex-1 bg-transparent border-none outline-none text-text-white text-3xl font-light placeholder:text-text-white/20 focus:ring-0"
            autoFocus
          />
        </div>

        {/* Right Side: Gemini Logo */}
        <div className="flex-shrink-0 ml-6">
          <Image 
            src="/Icons/gemini.png" 
            alt="Gemini AI Logo" 
            width={40} 
            height={40} 
            className="h-10 w-auto object-contain"
          />
        </div>
        
      </div>
    </div>
  );
}

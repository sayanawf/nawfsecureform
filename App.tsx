import React, { useState, useEffect } from 'react';
import { GridBackground } from './components/GridBackground';
import { Scanlines } from './components/Scanlines';
import { EntryView } from './views/EntryView';
import { SuccessView } from './views/SuccessView';
import { AppState, UserData } from './types';
import { GlitchText } from './components/GlitchText';

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLgYJrydpv23D4vyCZUYJ52vyPEmFU-VhIn5CXpvgNfs70ROQKujaOB6DLKkmnJG8k5g/exec"; 

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Simulate initial system boot
    if (appState === AppState.INTRO) {
      const timer = setTimeout(() => {
        setAppState(AppState.FORM);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setAppState(AppState.SUBMITTING);
    
    try {
      if (GOOGLE_SCRIPT_URL) {
        // We use mode: 'no-cors' to allow the browser to send data to Google Scripts.
        // We use 'text/plain' to ensure the data is sent as a simple string body, 
        // which prevents CORS preflight issues and ensures Apps Script receives it in e.postData.contents.
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", 
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({ name: data.name }),
        });
      } else {
        console.warn("GOOGLE_SCRIPT_URL is empty. Data was not sent to Sheets.");
      }
    } catch (error) {
      console.error("Transmission Failed:", error);
      // We proceed to success anyway so the user experience isn't broken
    }
    
    // Maintain the high-tech delay effect
    setTimeout(() => {
      setAppState(AppState.SUCCESS);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full bg-cyber-black text-cyber-text font-sans overflow-hidden selection:bg-cyber-primary selection:text-black">
      <GridBackground />
      <Scanlines />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center border-b border-white/5 bg-cyber-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyber-primary animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-cyber-primary/80">NAWF SECURE PROTOCOL v2.1</span>
          </div>
          <div className="font-mono text-xs text-gray-600">
            CONNECTION: <span className="text-green-500">ENCRYPTED</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-center items-center p-4">
          
          {appState === AppState.INTRO && (
            <div className="text-center">
               <div className="mb-4">
                 <div className="w-16 h-16 border-4 border-t-cyber-primary border-r-transparent border-b-cyber-secondary border-l-transparent rounded-full animate-spin mx-auto opacity-80" />
               </div>
               <GlitchText text="ESTABLISHING SECURE CONNECTION..." className="text-2xl md:text-4xl font-bold text-white tracking-widest" />
            </div>
          )}

          {(appState === AppState.FORM || appState === AppState.SUBMITTING) && (
            <EntryView onSubmit={handleFormSubmit} />
          )}

          {appState === AppState.SUCCESS && userData && (
            <SuccessView userData={userData} />
          )}

        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-white/5 text-center">
           <p className="font-mono text-[10px] text-gray-700 uppercase tracking-[0.3em]">
             Nawf ID: {Math.random().toString(36).substring(7).toUpperCase()} // Protected by NDA
           </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
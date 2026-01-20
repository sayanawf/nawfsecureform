import React, { useState, useEffect } from 'react';
import { GridBackground } from './components/GridBackground';
import { Scanlines } from './components/Scanlines';
import { EntryView } from './views/EntryView';
import { SuccessView } from './views/SuccessView';
import { AppState, UserData } from './types';
import { GlitchText } from './components/GlitchText';

// PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyT3zFKepEFlzfLNB9n_FqJrsVt2kqDn3WhvFfZXuJrUAlu9v0iXORl1ehBMOX2zFT5/exec"; 

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
    // 1. Set state to submitting
    setAppState(AppState.SUBMITTING);
    
    try {
      let token = "";

      if (GOOGLE_SCRIPT_URL) {
        // 2. Send data to Google Script
        // We removed 'no-cors' because we MUST read the response to get the token.
        // Google Apps Script must be deployed as "Anyone" for this to work without CORS errors.
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain", // Keep text/plain to avoid preflight OPTIONS request
          },
          body: JSON.stringify({ name: data.name }),
        });

        // 3. Extract the token from the response
        const result = await response.json();
        if (result && result.token) {
          token = result.token;
        }
      } else {
        console.warn("GOOGLE_SCRIPT_URL is empty. Running in demo mode.");
        token = "DEMO-TOKEN-" + Math.random().toString(36).substring(7);
      }

      // 4. Update user data with the received token
      setUserData({ ...data, token });

      // 5. Proceed to success
      setAppState(AppState.SUCCESS);

    } catch (error) {
      console.error("Transmission Failed:", error);
      // Fallback: Still allow entry but without a valid token (Website 2 will block this)
      setUserData({ ...data, token: "INVALID_TRANSMISSION" });
      setAppState(AppState.SUCCESS);
    }
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

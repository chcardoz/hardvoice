"use client";

import React, { useState } from "react";
import { useVapi } from "@/app/VapiProvider";
import BackgroundAuras from "@/app/components/BackgroundAuras";
import StatusDisplay from "@/app/components/StatusDisplay";
import CallControls from "@/app/components/CallControls";
import VoiceButton from "@/app/components/VoiceButton";

export default function HomeDepotVoiceAssistant() {
  const vapi = useVapi();

  const [status, setStatus] = useState<string>("Waiting to start...");
  const [transcript, setTranscript] = useState<string>("");
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [response, _setResponse] = useState<string>("");

  const startCall = async () => {
    try {
      setStatus("Starting call...");
      await vapi.start(process.env.NEXT_PUBLIC_ASSISTANT_ID);
      setStatus("Call started. Listening...");
      setIsCallActive(true);
      setIsListening(true);
    } catch (err) {
      console.error(err);
      setStatus("Error starting call.");
    }
  };

  const stopCall = async () => {
    try {
      setStatus("Ending call...");
      await vapi.stop();
      setStatus("Call ended.");
      setIsCallActive(false);
      setIsListening(false);
      setTranscript("");
    } catch (err) {
      console.error(err);
      setStatus("Error ending call.");
    }
  };

  const handleVoiceInput = () => {
    if (!isCallActive) {
      startCall();
    }
  };

  return (
    <div 
      className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center p-4"
      suppressHydrationWarning
    >
      <div className="absolute top-0 left-0 right-0 bg-[#F96302] p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <h1 className="text-2xl font-bold text-white">
            The Home Depot Assistant
          </h1>
        </div>
      </div>

      <div className="mt-20 w-full max-w-2xl flex flex-col items-center space-y-6">
        <div className="w-full bg-gray-100 rounded-lg p-4 text-center">
          <p className={`text-lg ${
            status.includes('Error') 
              ? 'text-red-600' 
              : status.includes('Listening') 
                ? 'text-[#F96302]' 
                : 'text-gray-700'
          }`}>
            {status}
          </p>
          {transcript && (
            <p className="mt-2 text-gray-600 italic">&ldquo;{transcript}&rdquo;</p>
          )}
        </div>

        <button
          onClick={handleVoiceInput}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-[#F96302] scale-110' 
              : 'bg-[#F96302] hover:bg-[#E65A02]'
          }`}
        >
          <div className={`absolute inset-0 rounded-full ${
            isListening ? 'animate-pulse bg-[#F96302]/50' : ''
          }`} />
          <svg 
            className="w-16 h-16 text-white z-10" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>

        {response && (
          <div className="w-full bg-white shadow-lg rounded-lg p-6 border-l-4 border-[#F96302]">
            <p className="text-gray-800">{response}</p>
          </div>
        )}

        <p className="text-gray-600 text-center max-w-md">
          {isListening 
            ? "I'm listening! Ask me about products, store locations, or how to tackle your next project." 
            : "Tap the microphone to start asking questions about products, store locations, or DIY advice."}
        </p>

        {isCallActive && (
          <button
            onClick={stopCall}
            className="text-gray-500 hover:text-red-600 text-sm underline mt-4"
          >
            End Conversation
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-4 text-center">
        <a href="https://github.com/chcardoz/hardvoice/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.83-.01-1.5-2.24.49-2.71-1.08-2.71-1.08-.36-.91-.88-1.15-.88-1.15-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.22 1.86.87 2.31.66.07-.51.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.66 7.66 0 018 3.5c.68 0 1.36.09 2 .26 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.14 0 3.06-1.87 3.75-3.65 3.95.29.25.55.74.55 1.49 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38C13.71 14.54 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub Repository
        </a>
      </div>
    </div>
  );
}

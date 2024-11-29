"use client";

import React, { useState } from "react";
import { useVapi } from "@/app/VapiProvider";
import BackgroundAuras from "@/app/components/BackgroundAuras";
import StatusDisplay from "@/app/components/StatusDisplay";
import CallControls from "@/app/components/CallControls";
import VoiceButton from "@/app/components/VoiceButton";

export default function VapiDarkAuraAssistant() {
  const vapi = useVapi();

  const [status, setStatus] = useState<string>("Waiting to start...");
  const [transcript, setTranscript] = useState<string>("");
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

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
    <div className="min-h-screen bg-[#121212] relative overflow-hidden flex flex-col items-center justify-center p-4">
      <BackgroundAuras />
      <StatusDisplay status={status} transcript={transcript} />
      <VoiceButton
        isListening={isListening}
        handleVoiceInput={handleVoiceInput}
      />
      {response && (
        <div className="relative max-w-md z-10 bg-[#1e1e1e]/80 p-6 border border-blue-500/10 rounded-lg">
          <p className="text-white/90">{response}</p>
        </div>
      )}
      <CallControls
        isCallActive={isCallActive}
        startCall={startCall}
        stopCall={stopCall}
      />
    </div>
  );
}

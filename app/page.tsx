"use client";

import React, { useState, useEffect } from "react";
import { useVapi } from "@/app/VapiProvider";
import BackgroundAuras from "@/app/components/BackgroundAuras";
import StatusDisplay from "@/app/components/StatusDisplay";
import CallControls from "@/app/components/CallControls";
import VoiceButton from "@/app/components/VoiceButton";
import Image from 'next/image';
import { Message, MessageType } from '@/app/lib/types/conversation.type';
import { MessageList } from '@/app/components/MessageList';

export default function HomeDepotVoiceAssistant() {
  const vapi = useVapi({
    debug: true,
    onTranscript: (transcript) => {
      console.log('Transcript:', transcript);
    },
    onMessage: (message) => {
      console.log('Message:', message);
    }
  });

  const [status, setStatus] = useState<string>("Waiting to start...");
  const [transcript, setTranscript] = useState<string>("");
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [response, _setResponse] = useState<string>("");
  const [navigationActive, setNavigationActive] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTranscript, setActiveTranscript] = useState<string | null>(null);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });

  // Helper function to get coordinates based on department
  const getDepartmentCoordinates = (department: string) => {
    const coordinates: { [key: string]: { x: number; y: number } } = {
      'windows': { x: 70, y: 10 },
      'doors': { x: 70, y: 10 },
      'plumbing': { x: 70, y: 30 },
      'lumber': { x: 90, y: 40 },
      'tools': { x: 70, y: 60 },
      'hardware': { x: 70, y: 60 },
      'indoor garden': { x: 40, y: 40 },
      'outdoor garden': { x: 20, y: 40 },
      'cleaning': { x: 40, y: 70 }
    };

    const dept = department.toLowerCase();
    return coordinates[dept] || { x: 50, y: 50 }; // Default center if department not found
  };

  useEffect(() => {
    if (!vapi) return;

    const handleTranscript = (transcript: any) => {
      console.log('Transcript event:', transcript);
      
      // Handle user transcripts
      if (transcript?.role === 'user') {
        if (!transcript.isFinal) {
          setActiveTranscript({
            text: transcript.text,
            isUser: true
          });
        } else {
          setActiveTranscript(null);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: transcript.text,
            type: MessageType.USER,
            timestamp: new Date()
          }]);
        }
      }
    };

    const handleMessage = (message: any) => {
      console.log('Message event:', message);
      
      // Handle different message types
      switch (message.type) {
        case 'transcript':
          if (message.role === 'assistant') {
            if (message.transcriptType === 'final') {
              setActiveTranscript(null);
              setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: message.transcript,
                type: MessageType.ASSISTANT,
                timestamp: new Date()
              }]);
            } else if (message.transcriptType === 'partial') {
              setActiveTranscript({
                text: message.transcript,
                isUser: false
              });
            }
          }
          break;

        case 'text':
          if (message.text) {
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              content: message.text,
              type: MessageType.ASSISTANT,
              timestamp: new Date()
            }]);
          }
          break;

        case 'speech-update':
          if (message.status === 'stopped') {
            setActiveTranscript(null);
          }
          break;
      }
    };

    vapi.on("transcript", handleTranscript);
    vapi.on("message", handleMessage);

    return () => {
      vapi.removeAllListeners();
    };
  }, [vapi]);

  // Debug monitor for messages state
  useEffect(() => {
    console.log('Messages state updated:', messages);
  }, [messages]);

  // Debug monitor for active transcript
  useEffect(() => {
    console.log('Active transcript updated:', activeTranscript);
  }, [activeTranscript]);

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

  const startNavigation = (department: string) => {
    setDestination(department);
    setNavigationActive(true);
    const coords = getDepartmentCoordinates(department);
    setDotPosition(coords);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col relative">
      {/* Content Layer - Increase z-index */}
      <div className="relative z-30 flex-1 flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#F96302] to-[#ff8534] p-6">
          <div className="max-w-6xl mx-auto flex items-center">
            <h1 className="text-3xl font-medium text-white">
              The Home Depot Assistant
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center mt-24 px-4">
          <div className="w-full max-w-2xl space-y-8">
            {/* Transcript Box */}
            <div className="w-full h-96 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col relative z-30">
              <MessageList 
                messages={messages}
                activeTranscript={activeTranscript}
              />
            </div>

            {/* Voice Controls Section - Add z-index */}
            <div className="relative z-30 flex flex-col items-center space-y-4">
              <button
                onClick={handleVoiceInput}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isListening 
                    ? 'bg-[#F96302] scale-110' 
                    : 'bg-[#F96302] hover:bg-[#E65A02]'
                }`}
              >
                <div className={`absolute inset-0 rounded-full ${
                  isListening ? 'animate-pulse bg-[#F96302]/40' : ''
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

              {/* Status Text */}
              <p className="text-gray-600 text-center max-w-md text-lg">
                {isListening 
                  ? "I'm listening! Ask me about products or locations." 
                  : "Tap the microphone to start asking questions."}
              </p>

              {/* Navigation Button */}
              <button
                onClick={() => setNavigationActive(true)}
                className="w-full p-4 rounded-xl bg-[#F96302] hover:bg-[#E65A02] text-white transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>Navigate to Product</span>
              </button>

              {/* End Conversation Button */}
              {isCallActive && (
                <button
                  onClick={stopCall}
                  className="px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>End Conversation</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto bg-white/80 backdrop-blur-sm border-t border-gray-100 relative z-30">
          {/* ... existing footer content ... */}
        </div>
      </div>

      {/* Robot Overlay */}
      <div className="fixed right-0 top-0 h-[1080px] w-auto pointer-events-none z-40">
        <div className="relative h-full w-[1000px]">
          <Image
            src="/Robot_Base.png"
            alt="Robot Background"
            fill
            sizes="(max-width: 1000px) 100vw, 1000px"
            className="opacity-20 object-contain object-right"
            priority
          />
        </div>
      </div>

      {/* Navigation Modal - Updated z-index */}
      {navigationActive && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-50 h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Navigating to {destination}
                </h3>
              </div>
              
              {/* Map Container */}
              <div className="h-80 bg-gray-50 rounded-xl overflow-hidden relative">
                <Image 
                  src="/IMG_7469.PNG"
                  alt="Store Layout"
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
                <div 
                  className="w-4 h-4 bg-[#F96302] rounded-full absolute transition-all duration-1000 ease-in-out shadow-lg animate-pulse"
                  style={{
                    left: `${dotPosition.x}%`,
                    top: `${dotPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </div>

              {/* Navigation Controls */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setNavigationActive(false)}
                  className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2"
                >
                  <span>Cancel Navigation</span>
                </button>
                <button
                  onClick={() => {}}
                  className="p-3 rounded-xl bg-[#F96302] hover:bg-[#E65A02] text-white flex items-center justify-center space-x-2"
                >
                  <span>Need Help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

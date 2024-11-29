import React, { useState } from 'react';
import { Mic } from 'lucide-react';

const DarkAuraAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setResponse("You'll find hammers in Aisle 7, Hardware section, on the left side.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated dot grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at center,
            rgba(255,255,255,0.1) 1px,
            transparent 1px)
        `,
        backgroundSize: '24px 24px',
        animation: 'moveGrid 30s linear infinite'
      }} />

      {/* Blue aura background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle at center, #2563eb, transparent)',
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
              animationDelay: `-${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main microphone button container */}
      <div className="relative bg-[#1e1e1e]/40 backdrop-blur-xl rounded-full p-8 mb-8">
        <button
          onClick={handleVoiceInput}
          className={`
            relative w-40 h-40 rounded-full 
            bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]
            flex items-center justify-center
            transition-all duration-300 group
            ${isListening ? 'scale-110' : 'scale-100'}
          `}
        >
          {/* Glowing ring effect */}
          <div className={`
            absolute inset-0 rounded-full
            bg-gradient-to-r from-blue-500/20 to-blue-400/20
            blur-xl transition-opacity duration-300
            ${isListening ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
          `} />

          {/* Animated border */}
          <div className={`
            absolute inset-[-2px] rounded-full border border-blue-400/20
            ${isListening ? 'animate-spin-slow' : ''}
          `} />

          {/* Microphone icon */}
          <Mic className={`
            w-12 h-12 z-10 transition-all duration-300
            ${isListening ? 'text-blue-300 scale-110' : 'text-blue-400/80'}
          `} />
        </button>
      </div>

      {/* Status text */}
      <p className="relative text-white/90 text-lg font-light z-10">
        {isListening ? 'Listening...' : 'Tap to ask a question'}
      </p>

      {/* Response area */}
      {response && (
        <div className="relative max-w-md mt-8 z-10">
          <div className="bg-[#1e1e1e]/80 backdrop-blur-lg rounded-lg p-6 border border-blue-500/10">
            <p className="text-white/90">{response}</p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-24px, -24px); }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(100px, 50px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DarkAuraAssistant;

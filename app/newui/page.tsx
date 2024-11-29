"use client"
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'motion/react';
import { useVapi } from '@/app/VapiProvider';

// Define message types for type safety
interface FunctionCallMessage {
  type: 'function-call';
  functionCall: {
    name: string;
    parameters: Record<string, string>;
  };
}

interface TranscriptMessage {
  type: 'transcript';
  text: string;
  transcriptType: 'partial' | 'final';
}

export default function VapiDarkAuraAssistant() {
  // Use the Vapi instance from context
  const vapi = useVapi(); 

  // State management
  const [toppings, setToppings] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('Waiting to start...');
  const [transcript, setTranscript] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');

  // Start call handler
  const startCall = async () => {
    try {
      setStatus('Starting call...');
      await vapi.start('0036146f-a3ec-4213-995a-4945cff7cfb8');
      setStatus('Call started. Listening...');
      setIsCallActive(true);
      setIsListening(true);
    } catch (err) {
      console.error(err);
      setStatus('Error starting call.');
      setIsCallActive(false);
      setIsListening(false);
    }
  };

  // Stop call handler
  const stopCall = async () => {
    try {
      setStatus('Ending call...');
      await vapi.stop();
      setStatus('Call ended.');
      setIsCallActive(false);
      setIsListening(false);
      setTranscript('');
    } catch (err) {
      console.error(err);
      setStatus('Error ending call.');
    }
  };

  // Message event handler
  useEffect(() => {
    const messageHandler = (msg: FunctionCallMessage | TranscriptMessage) => {
      if (msg.type === 'transcript') {
        if (msg.transcriptType === 'partial') {
          setTranscript(msg.text);
        } else if (msg.transcriptType === 'final') {
          setTranscript('');
        }
      } else if (msg.type === 'function-call') {
        if (msg.functionCall.name === 'addTopping') {
          const { topping } = msg.functionCall.parameters;
          setToppings((prev) => [...prev, topping]);
          setResponse(`Added ${topping} to your pizza.`);
        } else if (msg.functionCall.name === 'goToCheckout') {
          window.location.href = '/checkout';
        }
      }
    };

    vapi.on('message', messageHandler);

    return () => {
      vapi.off('message', messageHandler);
    };
  }, [vapi]);

  // Handle voice input simulation
  const handleVoiceInput = () => {
    if (!isCallActive) {
      startCall();
    }
  };

  // Framer Motion variants for background auras
  const auraVariants = {
    float: {
      y: [0, 50, 0],
      x: [0, 100, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated dot grid background */}
      <div 
        className="absolute inset-0 bg-[length:24px_24px] animate-[moveGrid_30s_linear_infinite]" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center,
              rgba(255,255,255,0.1) 1px,
              transparent 1px)
          `
        }} 
      />

      {/* Blue aura background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={auraVariants}
            animate="float"
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle at center, #2563eb, transparent)',
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Status and Transcript Display */}
      <div className="relative z-10 text-center mb-4">
        <p className="text-white/90 text-lg font-light mb-2">
          {status}
        </p>
        {transcript && (
          <p className="text-white/70 text-sm italic">
            {transcript}
          </p>
        )}
      </div>

      {/* Main microphone button container */}
      <div className="relative bg-[#1e1e1e]/40 backdrop-blur-xl rounded-full p-8 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          <motion.div 
            animate={{ 
              opacity: isListening ? [0.5, 1, 0.5] : 0,
              scale: isListening ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`
              absolute inset-0 rounded-full
              bg-gradient-to-r from-blue-500/20 to-blue-400/20
              blur-xl transition-opacity duration-300
            `} 
          />
          
          {/* Animated border */}
          <motion.div 
            animate={{ 
              rotate: isListening ? 360 : 0 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              linear: true
            }}
            className="absolute inset-[-2px] rounded-full border border-blue-400/20"
          />
          
          {/* Microphone icon */}
          <Mic className={`
            w-12 h-12 z-10 transition-all duration-300
            ${isListening ? 'text-blue-300 scale-110' : 'text-blue-400/80'}
          `} />
        </motion.button>
      </div>

      {/* Toppings Display */}
      <div className="relative z-10 max-w-md w-full bg-[#1e1e1e]/80 backdrop-blur-lg rounded-lg p-6 border border-blue-500/10 mb-4">
        <h2 className="text-white/90 text-xl font-semibold mb-2">Toppings:</h2>
        {toppings.length > 0 ? (
          <motion.ul 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="list-disc list-inside text-white/70"
          >
            {toppings.map((topping, index) => (
              <motion.li 
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {topping}
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <p className="text-white/50">No toppings selected yet</p>
        )}
      </div>

      {/* Response area */}
      {response && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md z-10"
        >
          <div className="bg-[#1e1e1e]/80 backdrop-blur-lg rounded-lg p-6 border border-blue-500/10">
            <p className="text-white/90">{response}</p>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="relative z-10 flex space-x-4 mt-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startCall} 
          disabled={isCallActive}
          className={`px-4 py-2 rounded text-white ${
            isCallActive 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          Start Call
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={stopCall}
          disabled={!isCallActive}
          className={`px-4 py-2 rounded text-white ${
            !isCallActive 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Stop Call
        </motion.button>
      </div>

      {/* Tailwind CSS animation for grid background */}
      <style jsx>{`
        @keyframes moveGrid {
          0% { background-position: 0 0; }
          100% { background-position: 24px 24px; }
        }
      `}</style>
    </div>
  );
}
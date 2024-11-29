import React from "react";
import { Mic } from "lucide-react";
import { motion } from "motion/react";

interface VoiceButtonProps {
  isListening: boolean;
  handleVoiceInput: () => void;
}

export default function VoiceButton({
  isListening,
  handleVoiceInput,
}: VoiceButtonProps) {
  return (
    <div className="relative bg-[#1e1e1e]/40 backdrop-blur-xl rounded-full p-8 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceInput}
        className={`relative w-40 h-40 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center ${
          isListening ? "scale-110" : "scale-100"
        }`}
      >
        <motion.div
          animate={{
            opacity: isListening ? [0.5, 1, 0.5] : 0,
            scale: isListening ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-400/20 blur-xl"
        />
        <Mic
          className={`w-12 h-12 z-10 ${
            isListening ? "text-blue-300" : "text-blue-400/80"
          }`}
        />
      </motion.button>
    </div>
  );
}

import React from "react";
import { motion } from "motion/react";

interface CallControlsProps {
  isCallActive: boolean;
  startCall: () => void;
  stopCall: () => void;
}

export default function CallControls({
  isCallActive,
  startCall,
  stopCall,
}: CallControlsProps) {
  return (
    <div className="relative z-10 flex space-x-4 mt-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startCall}
        disabled={isCallActive}
        className={`px-4 py-2 rounded text-white ${
          isCallActive
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
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
          isCallActive
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-500 cursor-not-allowed"
        }`}
      >
        Stop Call
      </motion.button>
    </div>
  );
}

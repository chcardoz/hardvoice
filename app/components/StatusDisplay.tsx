import React from "react";

interface StatusDisplayProps {
  status: string;
  transcript: string;
}

export default function StatusDisplay({ status, transcript }: StatusDisplayProps) {
  return (
    <div className="relative z-10 text-center mb-4">
      <p className="text-white/90 text-lg font-light mb-2">{status}</p>
      {transcript && (
        <p className="text-white/70 text-sm italic">{transcript}</p>
      )}
    </div>
  );
}

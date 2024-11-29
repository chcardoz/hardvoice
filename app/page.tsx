'use client';
import { useState } from 'react';
import { useVapi } from './VapiProvider';

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

export default function Home() {
  // Use the Vapi instance from context
  const vapi = useVapi(); 

  // State management
  const [toppings, setToppings] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('Waiting to start...');
  const [transcript, setTranscript] = useState<string>('');
  const [isCallActive, setIsCallActive] = useState<boolean>(false);

  // Start call handler
  const startCall = async () => {
    try {
      setStatus('Starting call...');
      await vapi.start('0036146f-a3ec-4213-995a-4945cff7cfb8');
      setStatus('Call started. Listening...');
      setIsCallActive(true);
    } catch (err) {
      console.error(err);
      setStatus('Error starting call.');
      setIsCallActive(false);
    }
  };

  // Stop call handler
  const stopCall = async () => {
    try {
      setStatus('Ending call...');
      await vapi.stop();
      setStatus('Call ended.');
      setIsCallActive(false);
      setTranscript('');
    } catch (err) {
      console.error(err);
      setStatus('Error ending call.');
    }
  };

  // Message event handler
  vapi.on('message', (msg: FunctionCallMessage | TranscriptMessage) => {
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
      } else if (msg.functionCall.name === 'goToCheckout') {
        window.location.href = '/checkout';
      }
    }
  });

  return (
    <main className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Pizza Ordering Assistant</h1>
      
      <div className="flex justify-center space-x-4 mb-4">
        <button 
          onClick={startCall} 
          disabled={isCallActive}
          className={`px-4 py-2 rounded ${
            isCallActive 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          Start Call
        </button>
        <button 
          onClick={stopCall}
          disabled={!isCallActive}
          className={`px-4 py-2 rounded ${
            !isCallActive 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Stop Call
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-semibold">Status: 
          <span className={`ml-2 ${
            status.includes('Error') 
              ? 'text-red-500' 
              : status.includes('started') 
                ? 'text-green-500' 
                : 'text-gray-500'
          }`}>
            {status}
          </span>
        </p>
        {transcript && (
          <p className="mt-2 italic text-gray-700">
            Live Transcript: {transcript}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Toppings:</h2>
        {toppings.length > 0 ? (
          <ul className="list-disc list-inside">
            {toppings.map((topping, index) => (
              <li key={index} className="text-gray-700">{topping}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No toppings selected yet</p>
        )}
      </div>
    </main>
  );
}
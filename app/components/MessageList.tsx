import { useEffect, useRef } from 'react';
import { Message, MessageType } from '@/app/lib/types/conversation.type';

interface MessageListProps {
  messages: Message[];
  activeTranscript?: {
    text: string;
    isUser: boolean;
  } | null;
}

export function MessageList({ messages, activeTranscript }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTranscript]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === MessageType.USER ? 'justify-end' : 'justify-start'
          }`}
        >
          <div 
            className={`max-w-[80%] rounded-2xl p-4 ${
              message.type === MessageType.USER 
                ? 'bg-[#F96302] text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block" suppressHydrationWarning>
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
      
      {activeTranscript && (
        <div className={`flex ${activeTranscript.isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-2xl p-4 ${
            activeTranscript.isUser 
              ? 'bg-[#F96302]/50 text-white' 
              : 'bg-gray-100/70 text-gray-800'
          }`}>
            <p className="text-sm italic">{activeTranscript.text}</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 
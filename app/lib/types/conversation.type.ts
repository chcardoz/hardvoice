export enum MessageType {
  USER = 'user',
  ASSISTANT = 'assistant',
  TRANSCRIPT = 'transcript',
  FUNCTION_RESULT = 'function_result'
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isFinal?: boolean;
} 
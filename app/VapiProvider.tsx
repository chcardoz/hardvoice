'use client';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import Vapi from '@vapi-ai/web';

// Define the Vapi instance type
type VapiInstance = InstanceType<typeof Vapi>;

// Create the context with a more explicit type
const VapiContext = createContext<{ vapi: VapiInstance | null }>({ vapi: null });

// Define the provider props
interface VapiProviderProps {
  children: ReactNode;
}

// Provider component
export const VapiProvider: React.FC<VapiProviderProps> = ({ children }) => {
  const vapi = useMemo(() => {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!token) {
      console.error('NEXT_PUBLIC_VAPI_WEB_TOKEN is not set.');
      return null;
    }
    return new Vapi(token);
  }, []);

  return (
    <VapiContext.Provider value={{ vapi }}>
      {children}
    </VapiContext.Provider>
  );
};

// Hook to use the Vapi context
export const useVapi = (): VapiInstance => {
  const context = useContext(VapiContext);
  if (!context || !context.vapi) {
    throw new Error('useVapi must be used within a VapiProvider and requires a valid token.');
  }
  return context.vapi;
};
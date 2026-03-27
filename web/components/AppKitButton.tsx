'use client';

import { useAppKit } from '../lib/hooks/useAppKit';
import { Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../providers/ToastProvider';
import {
  classifyConnectivityIssue,
  getConnectivityMessage,
  withTimeout,
} from '../app/lib/network-errors';

interface AppKitButtonProps {
  className?: string;
  label?: string;
}

export default function AppKitButton({ className, label = 'Connect Wallet' }: AppKitButtonProps) {
  const { open, isConnected, address } = useAppKit();
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <button 
        className={`flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/20 transition-colors font-medium text-sm ${className}`}
        disabled
      >
        <Wallet className="w-4 h-4" />
        Loading...
      </button>
    );
  }

  const handleConnect = async () => {
    try {
      await withTimeout(open(), 15000, 'Wallet connection timeout');
    } catch (error) {
      const issue = classifyConnectivityIssue(error);
      showToast(getConnectivityMessage(issue, 'Connecting wallet'), 'error');
    }
  };

  return (
    <>
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className={`flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/20 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
        >
          <Wallet className="w-4 h-4" />
          {label}
        </button>
      ) : (
        <w3m-button />
      )}
    </>
  );
}

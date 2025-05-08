import { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface NFCReaderProps {
  onRead?: (data: string) => void;
  autoStart?: boolean;
  className?: string;
}

export default function NFCReader({ 
  onRead, 
  autoStart = false,
  className = ''
}: NFCReaderProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(autoStart);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if Web NFC is supported
    if ('NDEFReader' in window) {
      setSupported(true);
    } else {
      setSupported(false);
      setError('NFC is not supported on this device or browser.');
    }
  }, []);

  useEffect(() => {
    if (!supported || !scanning) return;

    let abortController: AbortController | null = null;

    const readNFC = async () => {
      try {
        // @ts-ignore - TypeScript doesn't recognize NDEFReader
        const ndef = new window.NDEFReader();
        abortController = new AbortController();
        
        await ndef.scan({ signal: abortController.signal });
        
        setError(null);
        
        ndef.addEventListener("reading", ({ message }: any) => {
          for (const record of message.records) {
            if (record.recordType === "url" || record.recordType === "text") {
              const decoder = new TextDecoder();
              const data = decoder.decode(record.data);
              
              if (onRead) onRead(data);
            }
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to read NFC tag.');
        }
        setScanning(false);
      }
    };

    readNFC();

    return () => {
      if (abortController) abortController.abort();
    };
  }, [supported, scanning, onRead]);

  const startScanning = () => {
    setError(null);
    setScanning(true);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  if (supported === null) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="animate-pulse">
          <Smartphone className="h-12 w-12 text-primary/50" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Checking NFC support...</p>
      </div>
    );
  }

  if (supported === false) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <Smartphone className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {error || 'NFC is not supported on this device or browser.'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try using Chrome on Android or a desktop with NFC hardware.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {scanning ? (
        <motion.div 
          className="relative"
          onClick={stopScanning}
        >
          <Smartphone className="h-16 w-16 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      ) : (
        <div 
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={startScanning}
        >
          <Smartphone className="h-16 w-16" />
        </div>
      )}
      
      <p className="mt-3 font-medium">
        {scanning ? 'Tap NFC Card to Phone' : 'Tap to Start NFC Scanner'}
      </p>
      
      {error && (
        <p className="mt-2 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
}
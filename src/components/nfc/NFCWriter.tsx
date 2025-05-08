import { useState } from 'react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

interface NFCWriterProps {
  urlToWrite: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function NFCWriter({ 
  urlToWrite, 
  onSuccess, 
  onError,
  className = ''
}: NFCWriterProps) {
  const [supported, setSupported] = useState<boolean>('NDEFReader' in window);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const writeToTag = async () => {
    if (!supported) {
      const errorMsg = 'NFC is not supported on this device or browser.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    setWriting(true);
    setError(null);
    setSuccess(false);

    try {
      // @ts-ignore - TypeScript doesn't recognize NDEFReader
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: urlToWrite }]
      });
      
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      let errorMsg = 'Failed to write to NFC tag.';
      
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setWriting(false);
    }
  };

  if (!supported) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <Smartphone className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          NFC is not supported on this device or browser.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try using Chrome on Android or a desktop with NFC hardware.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {writing ? (
        <motion.div className="relative">
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
        <Smartphone className="h-16 w-16" />
      )}
      
      <p className="mt-3 font-medium">
        {writing ? 'Hold NFC Card to Phone' : 'Write Patient ID to NFC Card'}
      </p>
      
      {error && (
        <p className="mt-2 text-sm text-error-500">{error}</p>
      )}
      
      {success && (
        <p className="mt-2 text-sm text-success-500">Successfully wrote to NFC tag!</p>
      )}
      
      {!writing && (
        <Button 
          onClick={writeToTag} 
          className="mt-4"
          variant="gradient"
        >
          Write NFC Tag
        </Button>
      )}
    </div>
  );
}
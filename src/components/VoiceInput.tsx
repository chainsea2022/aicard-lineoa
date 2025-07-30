import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  onResult: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, placeholder, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  React.useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'zh-TW';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={isListening ? stopListening : startListening}
      className={`p-2 ${className}`}
      title={isListening ? '停止錄音' : '開始語音輸入'}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-red-500" />
      ) : (
        <Mic className="w-4 h-4 text-gray-500" />
      )}
    </Button>
  );
};

export default VoiceInput;
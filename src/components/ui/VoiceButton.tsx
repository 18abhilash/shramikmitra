import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  isRecording: boolean;
  isPlaying?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlay?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isRecording,
  isPlaying = false,
  onStartRecording,
  onStopRecording,
  onPlay,
  disabled = false,
  size = 'md',
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else if (onPlay && !isPlaying) {
      onPlay();
    } else {
      onStartRecording();
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const getIcon = () => {
    if (isPlaying) return <Volume2 size={iconSizes[size]} />;
    if (isRecording) return <MicOff size={iconSizes[size]} />;
    return <Mic size={iconSizes[size]} />;
  };

  const getColor = () => {
    if (isRecording) return 'bg-red-500 hover:bg-red-600';
    if (isPlaying) return 'bg-green-500 hover:bg-green-600';
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
      transition={isRecording ? { repeat: Infinity, duration: 1 } : {}}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} ${getColor()}
        rounded-full text-white shadow-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
      `}
    >
      {getIcon()}
    </motion.button>
  );
};
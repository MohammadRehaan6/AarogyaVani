import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface AudioVoicePlayerProps {
  currentLanguage: SupportedLanguage;
  textToRead: string;
  title?: string;
}

export const AudioVoicePlayer: React.FC<AudioVoicePlayerProps> = ({
  currentLanguage,
  textToRead,
  title = 'Listen to Health Instructions',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  useEffect(() => {
    // Stop speech if component unmounts or text changes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToRead]);

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = currentLanguage.speechCode;
    utterance.rate = speechRate;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce text-teal-300' : ''}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              Audio-Friendly Literacy Assistant
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
              {currentLanguage.name} ({currentLanguage.nativeName})
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">{title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Speed toggle */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-[11px] font-semibold">
          <button
            onClick={() => setSpeechRate(0.8)}
            className={`px-2 py-1 rounded-lg transition ${
              speechRate === 0.8 ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            0.8x
          </button>
          <button
            onClick={() => setSpeechRate(0.95)}
            className={`px-2 py-1 rounded-lg transition ${
              speechRate === 0.95 ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            1.0x
          </button>
          <button
            onClick={() => setSpeechRate(1.2)}
            className={`px-2 py-1 rounded-lg transition ${
              speechRate === 1.2 ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            1.2x
          </button>
        </div>

        {/* Play/Stop Button */}
        <button
          onClick={handleTogglePlay}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs shadow-sm transition flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Now</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition"
            title="Reset Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

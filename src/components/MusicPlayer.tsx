import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />

      <div className="relative p-6 flex flex-col gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-xl overflow-hidden shadow-lg border border-zinc-700 shrink-0"
          >
            <img 
              src={`${currentTrack.coverUrl}?t=${currentTrack.id}`} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3 
              key={`title-${currentTrack.id}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xl font-bold truncate text-zinc-100"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p 
              key={`artist-${currentTrack.id}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 font-medium truncate"
            >
              {currentTrack.artist}
            </motion.p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
                AI Generated
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
            <motion.div 
              className="absolute top-0 left-0 h-full cursor-pointer transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: currentTrack.color }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Volume2 className="w-4 h-4 text-zinc-500" />
             <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-zinc-600 rounded-full" />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <div className="p-2 text-zinc-500 opacity-0 group-hover:opacity-100">
            <Music className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Playlist Preview */}
      <div className="border-top border-zinc-800/50 bg-zinc-950/40 p-4">
        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-3 px-2">Up Next</p>
        <div className="space-y-1">
          {TRACKS.map((track, i) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${i === currentTrackIndex ? 'bg-zinc-800/50 text-white' : 'text-zinc-500 hover:bg-zinc-800/30'}`}
            >
              <span className="font-mono text-xs opacity-50">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="text-sm font-medium truncate flex-1 text-left">{track.title}</span>
              {i === currentTrackIndex && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3, 2].map((h, j) => (
                    <motion.div 
                      key={j}
                      animate={{ height: ['40%', '100%', '60%'] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.1 }}
                      className="w-1 bg-current rounded-full"
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

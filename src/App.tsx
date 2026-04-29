import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { LayoutGrid, Music, Gamepad2, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      {/* Sidebar / Branding */}
      <div className="fixed top-0 left-0 h-full w-20 border-r border-zinc-800 flex flex-col items-center py-8 gap-8 bg-zinc-950/50 backdrop-blur-md z-50">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          <LayoutGrid className="w-6 h-6" />
        </div>
        
        <div className="flex-1 flex flex-col gap-6 justify-center text-zinc-600">
           <Music className="w-6 h-6 hover:text-cyan-400 cursor-pointer transition-colors" />
           <Gamepad2 className="w-6 h-6 text-cyan-400 cursor-pointer transition-colors" />
        </div>

        <div className="text-zinc-700 hover:text-white cursor-pointer transition-colors pb-4">
          <Github className="w-6 h-6" />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-12 p-8 pt-20 md:pt-8 bg-[radial-gradient(circle_at_20%_20%,#1e1b4b_0%,transparent_50%)]">
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]">
           <div className="h-full w-full bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Title Overlay */}
        <div className="absolute top-8 left-28 z-10 pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            Neon <span className="text-cyan-400 neon-glow">Groove</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs mt-1 tracking-[0.4em] uppercase">Synthwave Audio Arcade // v1.0.4</p>
        </div>

        {/* Snake Game Module */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10"
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-500/60">Module A // Snake</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse delay-75" />
              <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse delay-150" />
            </div>
          </div>
          <SnakeGame />
        </motion.section>

        {/* Music Player Module */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-rose-500/60">Module B // Audio</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <div className="font-mono text-[10px] text-zinc-500">STANDBY</div>
            </div>
          </div>
          <MusicPlayer />
        </motion.section>

        {/* Decoration / Status Bar */}
        <div className="fixed bottom-0 left-20 right-0 h-10 border-t border-zinc-900 bg-black/80 backdrop-blur-sm px-8 flex items-center justify-between text-[10px] font-mono text-zinc-600">
           <div className="flex gap-6 uppercase tracking-widest">
              <span>LATENCY: 12ms</span>
              <span>RENDER: OK</span>
              <span>UPTIME: 99.9%</span>
           </div>
           <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="uppercase">Server Protocol Established</span>
           </div>
        </div>
      </main>
    </div>
  );
}

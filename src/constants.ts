import { Track } from "./types";

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Synthwave Pulse",
    artist: "Neon Ghost",
    coverUrl: "https://picsum.photos/seed/synthwave/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff00ff" // Magenta
  },
  {
    id: "2",
    title: "Cybernetic Beats",
    artist: "Glitch Master",
    coverUrl: "https://picsum.photos/seed/cyber/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff" // Cyan
  },
  {
    id: "3",
    title: "Neon Night Drive",
    artist: "Vapor Wave",
    coverUrl: "https://picsum.photos/seed/nightdrive/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ff8800" // Orange
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
export const INITIAL_DIRECTION = "UP";
export const TICK_RATE = 150;

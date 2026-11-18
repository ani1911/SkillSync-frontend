export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Socket.io MUST connect directly to the backend — Vercel cannot proxy WebSockets.
// In production: set VITE_SOCKET_URL = https://skillsync-4xbt.onrender.com in Vercel env vars.
// In development: falls back to localhost:3000 (same as BASE_URL).
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face";

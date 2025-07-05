// 🧠 Copilot: Replace all axios or fetch calls that use http://localhost:3000
// with relative paths starting with /api/, to support Nginx reverse proxy setup.

// Original host for direct backend connections (development mode)
export const HOST = "172.20.10.2";

// Use relative URLs for production (behind Nginx proxy)
// When served from localhost (port 80), use relative paths
export const API_BASE_URL = "";  // Empty string for relative URLs

// WebSocket URL for socket.io connections through proxy
export const WS_BASE_URL = "";

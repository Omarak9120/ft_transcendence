# ft_transcendence

A modern, real-time multiplayer Pong game built as a Single Page Application (SPA) with TypeScript, Tailwind CSS, and Socket.IO.

## Features

- **Real-time Multiplayer Pong**: Play against other users with WebSocket-powered real-time gameplay
- **Tournament System**: Create and participate in tournaments
- **User Authentication**: Secure login/signup with 2FA support
- **Chat System**: Real-time messaging with other players
- **Friend System**: Add friends, view profiles, and see stats
- **Game History**: Track your wins, losses, and game statistics
- **Responsive Design**: Modern UI with Tailwind CSS
- **AI Opponents**: Play against computer opponents

## Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript modules** - No framework dependencies
- **Chart.js** - Statistics visualization
- **Socket.IO Client** - Real-time communication

### Backend
- **Fastify** - High-performance Node.js web framework
- **Socket.IO** - Real-time bidirectional communication
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **Docker Compose** - Multi-container orchestration

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ft_transcendence
   ```

2. **Start the application**
   ```bash
   docker-compose -f docker-compose-nginx.yml up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api

### Local Development

1. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   npm run dev

   # Backend (in another terminal)
   cd backend
   npm install
   npm run dev
   ```

2. **Access the development server**
   - Frontend: http://localhost:5500
   - Backend: http://localhost:3000

## Project Structure

```
ft_transcendence/
├── frontend/                   # Frontend application
│   ├── src/                   # TypeScript source files
│   │   ├── auth.ts           # Authentication logic
│   │   ├── main.ts           # Game logic
│   │   ├── nav.ts            # Navigation handling
│   │   └── ...
│   ├── index.html            # Main HTML file
│   ├── package.json          # Frontend dependencies
│   └── Dockerfile            # Frontend container config
├── backend/                   # Backend API
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── server.ts            # Main server file
│   ├── package.json         # Backend dependencies
│   └── Dockerfile           # Backend container config
├── nginx/                    # Nginx configuration
│   └── nginx.conf           # Reverse proxy config
├── docker-compose-nginx.yml  # Production Docker setup
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /signup` - Create new user account
- `POST /login` - User login
- `GET /api/users/me` - Get current user info

### Game & Tournament
- `GET /api/tournament` - Get tournament data
- `POST /api/tournament` - Create tournament
- `GET /api/match` - Get match history
- `POST /api/match` - Record match result

### Social Features
- `GET /api/users/me/friends` - Get friends list
- `POST /api/friends/add` - Send friend request
- `GET /api/notifications` - Get notifications

### WebSocket Events
- `gameInvite` - Game invitation
- `chatMessage` - Chat messages
- `notification` - Real-time notifications

## Testing

### Manual Testing
Run the comprehensive manual testing suite:

```bash
# See MANUAL_TESTING_RESULTS.md for detailed test cases
# See BROWSER_TESTING_GUIDE.md for browser testing instructions
# See FRONTEND_TESTING_CHECKLIST.md for frontend-specific tests
```

### Key Testing Areas
- ✅ Authentication (signup/login/2FA)
- ✅ SPA routing and navigation
- ✅ Real-time game functionality
- ✅ WebSocket connections
- ✅ Tournament system
- ✅ Friend system and notifications
- ✅ Responsive design

## Docker Configuration

### Development
```bash
docker-compose up -d
```

### Production with Nginx
```bash
docker-compose -f docker-compose-nginx.yml up -d
```

### Container Services
- **Frontend**: Nginx serving static files and SPA routing
- **Backend**: Fastify API server with Socket.IO
- **Nginx**: Reverse proxy routing `/api/*` to backend

## Troubleshooting

### Common Issues

1. **JavaScript modules not loading**
   - Ensure the frontend container has the correct `/dist` directory structure
   - Check that TypeScript compilation completed successfully

2. **WebSocket connection failures**
   - Verify all containers are running
   - Check that Socket.IO routes are configured in Nginx

3. **API 404 errors**
   - Ensure Nginx proxy routes are configured correctly
   - Check backend container logs: `docker logs ft_transcendence-backend-1`

4. **Database issues**
   - Reset database: Remove the SQLite file and restart backend
   - Check database permissions in the container

### Useful Commands
```bash
# Check container status
docker ps

# View logs
docker logs ft_transcendence-frontend-1
docker logs ft_transcendence-backend-1
docker logs ft_transcendence-nginx-1

# Rebuild containers
docker-compose -f docker-compose-nginx.yml up -d --build

# Access container shell
docker exec -it ft_transcendence-frontend-1 sh
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly using the manual testing guide
4. Submit a pull request

## Documentation

- [Nginx Setup Guide](NGINX_SETUP.md)
- [Manual Testing Results](MANUAL_TESTING_RESULTS.md)
- [Browser Testing Guide](BROWSER_TESTING_GUIDE.md)
- [Frontend Testing Checklist](FRONTEND_TESTING_CHECKLIST.md)
- [Testing Status](TESTING_STATUS.md)

## License

This project is part of the 42 School curriculum.

✅ Transcendence Testing & README Guide

🎯 Project Overview

Transcendence is a full-stack web application built for 42 School as part of the final project. It features:

SPA (Single Page Application) using TypeScript + Tailwind CSS (no frameworks like React allowed)

Game interface, friends system, leaderboard, profile, chat

Backend built with Fastify (Node.js) and WebSocket

Full Dockerized environment with Nginx reverse proxy and SSL

✅ Manual Testing Checklist

🔐 Authentication

Test user registration through /signup

Test login with valid credentials

Test login with invalid credentials (expect error)

JWT token received and stored in cookies or localStorage

Protected routes return 401 when unauthenticated

👤 Profile

View profile data (username, email, avatar)

Edit and update profile successfully

Avatar uploads reflected in UI

👥 Friends System

Send friend requests

Accept/decline friend requests

View friend list

Remove friends

🕹️ Game Feature

Start a game session

Real-time gameplay via WebSocket

Game ends properly and updates user stats

🏆 Leaderboard

View top users sorted by wins or scores

Dynamic update after new game results

📨 Chat

Send and receive real-time messages

View user online status

WebSocket-based message delivery

🌐 SPA Routing

Direct access to routes like /profile, /signup works

Back/forward buttons retain application state

No 404 on page refresh due to catch-all routing

🔧 DevOps / Docker

Docker Compose starts all services

Frontend, Backend, Nginx, and DB containers all healthy

Self-signed SSL certificates for HTTPS

All traffic routed through Nginx reverse proxy

# 🕹️ ft_transcendence
Final project for 42 School: A full-stack Pong-based social gaming web app

## 🚀 Features
- User authentication & profile
- Real-time chat and gameplay (WebSocket)
- Friends system, leaderboard
- Fully Dockerized with Nginx reverse proxy
- Single Page App (SPA) architecture (no frameworks)

## 🛠️ Tech Stack
- Frontend: TypeScript + TailwindCSS (no React/Vue)
- Backend: Node.js (Fastify), better-sqlite3
- WebSocket: socket.io
- Docker + Nginx

## 🧪 Run Locally
### Prerequisites:
- Docker & Docker Compose

### Start the App
```bash
docker-compose -f docker-compose-nginx.yml up --build
```

Then go to: `http://localhost`

### File Structure

```
.
├── frontend/
│   ├── index.html
│   └── ...
├── backend/
│   ├── main.ts
│   └── routes/
├── nginx/
│   ├── nginx.conf
│   └── certs/
└── docker-compose-nginx.yml
```

### Docker Setup Explanation for Partners

This project includes a complete **Docker-based deployment architecture** that ensures modularity, scalability, and ease of use:

- **Frontend**: Runs inside a container and builds static assets using TypeScript and TailwindCSS. Served via Nginx.
- **Backend**: A Node.js server using Fastify that handles all authentication, game logic, and data storage.
- **Nginx**: Acts as a reverse proxy. It handles SSL termination, HTTPS redirection, API routing (/api/*), WebSocket proxying, and Single Page Application fallback routing.
- **Volumes and Networking**: Docker Compose sets up inter-container communication via internal networks. No ports are directly exposed except by Nginx.
- **Security**: Self-signed certificates are created and mounted securely inside the Nginx container. SSL termination occurs at Nginx level.

This Docker setup allows seamless development, testing, and deployment while strictly adhering to 42 School requirements.

### Environment Variables
- All config handled inside Docker. No external `.env` required.

## 📜 License
This project is part of the 42 School curriculum.
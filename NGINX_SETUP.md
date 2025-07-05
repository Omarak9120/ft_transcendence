# Nginx SSL/HTTPS Setup for ft_transcendence

## Overview

This document describes the complete setup of an Nginx reverse proxy with SSL/HTTPS for the ft_transcendence project.

## Architecture

```
Internet → Nginx (SSL Termination) → Frontend (port 80) + Backend (port 3001)
```

## Files Added/Modified

### 1. SSL Certificates

- `certs/server.crt` - Self-signed SSL certificate
- `certs/server.key` - Private key for SSL certificate

### 2. Nginx Configuration

- `nginx/nginx.conf` - Complete Nginx configuration with:
  - SSL/TLS configuration
  - HTTP to HTTPS redirect
  - Reverse proxy for backend API
  - Frontend static file serving
  - Security headers

### 3. Docker Configuration

- `docker-compose-nginx.yml` - New Docker Compose file with Nginx service
- `frontend/Dockerfile` - Updated to use multi-stage build with Nginx

## Services

### Nginx Service

- **Port**: 80 (HTTP) and 443 (HTTPS)
- **SSL**: Enabled with self-signed certificates
- **Features**:
  - Automatic HTTP to HTTPS redirect
  - API proxy to backend at `/api/*`
  - Static file serving for frontend
  - Security headers (HSTS, CSP, etc.)

### Frontend Service

- **Technology**: Nginx (Alpine)
- **Port**: 80 (internal)
- **Build**: Multi-stage build with TypeScript compilation

### Backend Service

- **Technology**: Node.js
- **Port**: 3001 (internal)
- **Database**: SQLite

## Security Features

1. **SSL/TLS Encryption**: All traffic encrypted using TLS 1.2/1.3
2. **HSTS**: HTTP Strict Transport Security enabled
3. **CSP**: Content Security Policy headers
4. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
5. **Secure Cookies**: SSL-only cookie configuration

## Usage

### Starting the Application

```bash
docker-compose -f docker-compose-nginx.yml up -d
```

### Stopping the Application

```bash
docker-compose -f docker-compose-nginx.yml down
```

### Viewing Logs

```bash
# All services
docker-compose -f docker-compose-nginx.yml logs

# Specific service
docker logs ft_transcendence-nginx-1
docker logs ft_transcendence-frontend-1
docker logs ft_transcendence-backend-1
```

### Rebuilding

```bash
docker-compose -f docker-compose-nginx.yml build
```

## Access URLs

- **HTTPS (Secure)**: https://localhost
- **HTTP**: http://localhost (redirects to HTTPS)
- **Backend API**: https://localhost/api/\*

## Certificate Information

The SSL certificates are self-signed and valid for:

- localhost
- 127.0.0.1
- ::1

**Note**: Browsers will show a security warning for self-signed certificates. This is normal for development environments.

## Production Considerations

For production deployment:

1. **Replace self-signed certificates** with certificates from a trusted CA (Let's Encrypt, etc.)
2. **Update CSP headers** to match your domain
3. **Configure proper logging** and monitoring
4. **Set up automatic certificate renewal**
5. **Use environment variables** for sensitive configuration
6. **Enable rate limiting** and DDoS protection

## Troubleshooting

### Common Issues

1. **Certificate Warnings**: Normal for self-signed certificates
2. **Port Conflicts**: Ensure ports 80 and 443 are available
3. **API Not Working**: Check backend container logs
4. **Static Files Missing**: Verify frontend build process

### Checking Container Status

```bash
docker-compose -f docker-compose-nginx.yml ps
```

### Accessing Container Shell

```bash
# Nginx container
docker exec -it ft_transcendence-nginx-1 sh

# Frontend container
docker exec -it ft_transcendence-frontend-1 sh

# Backend container
docker exec -it ft_transcendence-backend-1 bash
```

## File Structure

```
ft_transcendence/
├── certs/
│   ├── server.crt
│   └── server.key
├── nginx/
│   └── nginx.conf
├── frontend/
│   └── Dockerfile (updated)
├── docker-compose-nginx.yml
└── NGINX_SETUP.md
```

## Benefits of This Setup

1. **Production-Ready**: Similar to production SSL configurations
2. **Security**: All traffic encrypted and secured
3. **Performance**: Nginx efficiently serves static files
4. **Scalability**: Easy to add load balancing and caching
5. **Development**: Mirrors production environment
6. **Standards Compliance**: Follows web security best practices

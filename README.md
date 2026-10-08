# Emmbros Autocomp Ltd — CMS & Web Application Platform

Complete custom WordPress-style Content Management System (CMS) and React application for **Emmbros Autocomp Ltd**.

Provides full management of **Blog Posts**, **Job Postings & Applicants**, **On-Page Yoast-Style SEO**, **301 URL Redirects**, **Media Library (with WebP optimization)**, **Site Settings**, and **Role-Based User Accounts**.

---

## Quick Start & Local Development

### Prerequisites
- **Node.js** v18+ or v20+
- **MongoDB** (Local instance or MongoDB Atlas; falls back automatically to `mongodb-memory-server` if no URI is provided).

### 1. Installation
```bash
# Navigate to project directory
cd emmbros-react

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Environment Configuration (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=4000
NODE_ENV=development

# Database (Leave blank or set to 'memory' for zero-config in-memory MongoDB)
MONGODB_URI=mongodb://127.0.0.1:27017/emmbros

# JWT Session Authentication Secret
JWT_SECRET=emmbros_super_secret_jwt_key_2026_change_in_production

# Initial Admin User Credentials
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@emmbrosautocomp.com
ADMIN_PASSWORD=Admin@12345

# SMTP Configuration for Contact Form & Job Application Notifications
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
ADMIN_NOTIFICATION_EMAIL=careers@emmbros.com

# Allowed CORS & CSRF Origins (comma separated)
ALLOWED_ORIGINS=http://localhost:4000,http://127.0.0.1:4000,https://emmbros.com
```

### 3. Seed Initial Admin Account
```bash
npm --prefix server run seed:admin
```
*Creates the initial administrator account with role `admin`.*

### 4. Build Frontend & Start Server
```bash
# Build React Production Bundle
npm --prefix client run build

# Start Node Express Production Server
npm --prefix server start
```

Access the application:
- **Public Website**: `http://localhost:4000`
- **Admin Panel**: `http://localhost:4000/admin` (Log in with `admin@emmbrosautocomp.com` / `Admin@12345`)

---

## System Architecture & Key Features

### 1. **Role-Based Access Control (RBAC)**
- **Admin**: Full access to all features, including User Account Management (`/admin/users`) and Site Configuration Settings (`/admin/settings`).
- **Editor**: Access to Blog Posts, Job Postings, Candidate Applications, Pages SEO, Media Library, and 301 Redirects. Restricted from User Management and Site Settings.

### 2. **Yoast-Style On-Page SEO Engine (`<SeoPanel />`)**
- Live Google Search Snippet Preview (Desktop & Mobile toggle).
- Character counters & color-coded progress bars for Meta Title (50-60 chars) and Meta Description (120-155 chars).
- Open Graph & Twitter Social preview card.
- Client-side 16-point SEO & Readability audit checklist (Focus keyword, keyword density, sentence length, long paragraphs, passive voice heuristic).

### 3. **Careers & Job Application System**
- Open jobs directory with department filters (`/careers`).
- Application submission form accepting candidate details and PDF/DOC/DOCX resume file uploads (max 5 MB).
- Admin candidate review portal (`/admin/jobs/:id/applications`) with status tracking (`New`, `Reviewed`, `Shortlisted`, `Rejected`).
- Automated email notification to HR via Nodemailer.
- `node-cron` worker automatically marking expired jobs as `closed` after `applyByDate`.

### 4. **Server-Side Crawlable SEO Injection & Structured Data**
- Node Express server intercepts requests for `/blog/:slug` and `/careers/:slug` to inject `<title>`, `<meta description>`, OpenGraph, and Twitter tags into served HTML before sending.
- Injects JSON-LD structured data:
  - `Article` schema for blog posts.
  - `JobPosting` schema for career vacancies (including hiring organization & Baddi location).
  - `Organization` schema for homepage.
- Serves dynamic `/sitemap.xml` and `/robots.txt`.

### 5. **301 URL Redirect Engine**
- Manage legacy URL redirects at `/admin/redirects`.
- Server middleware intercepts requests and returns `301 Permanent Redirect` status headers.

---

## Production Deployment & Maintenance

### 1. Process Management (PM2)
Run the server under PM2 for automatic restarts and zero-downtime reloads:
```bash
npm install -g pm2
cd server
pm2 start index.js --name "emmbros-cms"
pm2 save
```

### 2. Nginx Reverse Proxy Configuration
```nginx
server {
    listen 80;
    server_name emmbros.com www.emmbros.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name emmbros.com www.emmbros.com;

    ssl_certificate /etc/letsencrypt/live/emmbros.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/emmbros.com/privkey.pem;

    client_max_body_size 15M;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Automated Database & Uploads Backup Recommendation
Set up a daily cron job to back up the MongoDB database and uploads directory:

```bash
#!/bin/bash
# Backup script: /opt/scripts/backup-emmbros.sh
BACKUP_DIR="/var/backups/emmbros/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

# 1. Backup MongoDB
mongodump --uri="mongodb://127.0.0.1:27017/emmbros" --out="$BACKUP_DIR/mongo"

# 2. Archive Uploaded Resumes & Media Files
tar -czf "$BACKUP_DIR/uploads.tar.gz" -C /path/to/emmbros-react/client/public/uploads .

# Delete backups older than 30 days
find /var/backups/emmbros/* -mtime +30 -exec rm -rf {} \;
```
Add to crontab (`crontab -e`):
```cron
0 2 * * * /opt/scripts/backup-emmbros.sh >/dev/null 2>&1
```

---

## License & Support
Internal Proprietary Software for **Emmbros Autocomp Ltd**, Baddi, Himachal Pradesh, India. All rights reserved.

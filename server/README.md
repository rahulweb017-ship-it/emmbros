# Emmbros Autocomp Backend API Documentation

This directory houses the Node.js Express backend foundation for Emmbros Autocomp Ltd. It includes authentication, MongoDB models (Post, Job, Page, Media, User), reusable Yoast-style SEO metadata schemas, admin management routes, and public content APIs.

---

## 🚀 Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration uses an in-memory MongoDB instance when `MONGODB_URI=memory` or left unset.

### 2. Seeding Initial Admin User
Run the admin seed script:
```bash
npm run seed:admin
```
This creates the initial admin user using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`.

---

## 🔑 Authentication APIs (`/api/auth`)

### `POST /api/auth/login`
- **Rate Limit**: Max 10 requests / 15 minutes per IP.
- **Request Body**:
  ```json
  {
    "email": "admin@emmbrosautocomp.com",
    "password": "Admin@12345"
  }
  ```
- **Response**: Sets `token` in `httpOnly` cookie and returns user details.
  ```json
  {
    "ok": true,
    "token": "jwt_token_here",
    "user": {
      "_id": "...",
      "name": "System Administrator",
      "email": "admin@emmbrosautocomp.com",
      "role": "admin"
    }
  }
  ```

### `POST /api/auth/logout`
- Clears the authentication HTTP cookie.

### `GET /api/auth/me`
- **Auth Required**: Yes
- Returns current logged-in user details.

---

## 🌐 Public APIs (`/api`)

Public routes return **only** published posts, open job listings, and active page SEO metadata.

### `GET /api/posts`
- **Query Params**: `?page=1`, `?limit=10`, `?category=Forging`, `?search=quality`
- **Returns**: Paginated list of published posts with SEO sub-schema.

### `GET /api/posts/:slug`
- **Returns**: Full single published post by unique slug.

### `GET /api/jobs`
- **Query Params**: `?page=1`, `?limit=10`, `?department=Marketing`, `?search=executive`
- **Returns**: Paginated list of open jobs with SEO sub-schema.

### `GET /api/jobs/:slug`
- **Returns**: Single open job posting by unique slug.

### `GET /api/pages/:slug`
- **Returns**: Dynamic page metadata and content blocks by unique slug.

---

## 🛡️ Admin Management APIs (`/api/admin`)

*All admin endpoints require an active JWT session (`httpOnly` cookie or `Authorization: Bearer <token>`) with `admin` or `editor` role.*

### Blog Posts (`/api/admin/posts`)
- `GET /api/admin/posts` (Query: `?page=`, `?limit=`, `?status=`, `?q=`)
- `POST /api/admin/posts` (Creates post, auto-generates slug, sanitizes HTML)
- `GET /api/admin/posts/:id`
- `PUT /api/admin/posts/:id`
- `DELETE /api/admin/posts/:id`

### Job Postings (`/api/admin/jobs`)
- `GET /api/admin/jobs` (Query: `?page=`, `?limit=`, `?status=`, `?q=`)
- `POST /api/admin/jobs` (Creates job posting)
- `GET /api/admin/jobs/:id`
- `PUT /api/admin/jobs/:id`
- `DELETE /api/admin/jobs/:id`

### Pages (`/api/admin/pages`)
- `GET /api/admin/pages`
- `POST /api/admin/pages`
- `GET /api/admin/pages/:id`
- `PUT /api/admin/pages/:id`
- `DELETE /api/admin/pages/:id`

### Media Uploads (`/api/admin/media`)
- `GET /api/admin/media`
- `POST /api/admin/media/upload` (Multipart `file` upload)
- `DELETE /api/admin/media/:id`

---

## 🔍 Yoast-Style SEO Sub-Schema

All `Post`, `Job`, and `Page` documents embed an `seo` sub-schema:

```json
"seo": {
  "metaTitle": "Custom Page Title | Emmbros",
  "metaDescription": "Optimized meta snippet for search engines.",
  "focusKeyword": "automotive parts manufacturer",
  "canonicalUrl": "https://emmbrosautocomp.com/custom-url",
  "ogTitle": "Social Title",
  "ogDescription": "Social Sharing Snippet",
  "ogImage": "/uploads/social-banner.jpg",
  "noindex": false,
  "nofollow": false
}
```

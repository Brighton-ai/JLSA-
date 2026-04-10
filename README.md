# Joshlee Solutions Africa Website

A production-ready website with a full admin dashboard backed by MongoDB.

## Project Structure

```
jlsa/
├── index.html      ← Main website (HTML only)
├── styles.css      ← All CSS styles
├── app.js          ← Frontend JavaScript
├── admin.html      ← Admin dashboard (login + editor)
├── server.js       ← Express backend + MongoDB API
├── package.json    ← Node dependencies
└── README.md
```

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Server runs at: **http://localhost:3000**
Admin panel at: **http://localhost:3000/admin**

## Admin Login

| Field    | Value       |
|----------|-------------|
| Username | `admin`     |
| Password | `jlsa2025`  |

To change credentials, set environment variables:
```bash
ADMIN_USER=yourusername ADMIN_PASS=yourpassword node server.js
```

## MongoDB

Default connection string is already configured for your Atlas cluster.

To override:
```bash
MONGO_URI="your-mongo-uri" node server.js
```

## What the Admin Can Edit

| Section       | What's editable                                      |
|---------------|------------------------------------------------------|
| Hero          | Tag, headline, italic word, subtitle, description    |
| About         | Label, heading, body paragraph                       |
| Services      | All 8 cards: icon, title, description, tags          |
| Products      | All 6 cards: icon, title, description, features      |
| Clients       | Add/edit/delete client cards (name, location, type)  |
| Testimonials  | Add/edit/delete quotes (text, name, org, initials)   |
| Contact       | Phone, email, website, location, section copy        |
| Pull Quote    | Quote text and attribution                           |
| Theme Colors  | All 8 brand colors (live preview + save to DB)       |
| Typography    | Display and body font selection                      |

## Nav Fix

Nav links and logo name are now **white on the dark hero** background
and switch to **dark text** once the user scrolls (`.scrolled` class).
The CTA button uses gold on dark and purple on light.

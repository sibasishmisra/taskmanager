# TaskFlow

A modern, multi-user task management web app built with Next.js, Prisma, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)

---

## Features

- **Authentication** — Secure register/login with hashed passwords via NextAuth.js
- **Task Management** — Create, edit, delete tasks with full detail control
- **Status Tracking** — Todo → In Progress → Done with one-click cycling
- **Priorities** — Low, Medium, High, Urgent with color-coded badges
- **Due Dates** — Date picker with overdue highlighting
- **Categories** — Custom categories with color labels
- **Tags** — Comma-separated tags per task
- **Recurring Tasks** — Mark tasks as daily, weekly, or monthly recurring
- **Search & Filters** — Filter by status, priority, and category in real time
- **Grid / List View** — Toggle between card grid and compact list
- **Analytics** — Completion rate ring, status breakdown, priority and category charts
- **Multi-user** — Each user has their own isolated data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (via Prisma) |
| ORM | Prisma |
| Auth | NextAuth.js (Credentials) |
| Password Hashing | bcryptjs |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sibasishmisra/taskmanager.git
cd taskmanager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret with:
```bash
openssl rand -base64 32
```

### 4. Set up the database

```bash
npx prisma db push
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
Task-manager/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + register endpoints
│   │   ├── tasks/         # CRUD task API
│   │   └── categories/    # Categories API
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/
│   └── register/
├── components/            # All UI components
├── lib/                   # Prisma client, auth config, utils
├── prisma/
│   └── schema.prisma      # Database schema
└── types/                 # TypeScript types
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npx prisma db push` | Sync schema to database |
| `npx prisma studio` | Open Prisma database GUI |

---

## License

MIT

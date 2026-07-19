# Jeem GPT

Jeem GPT is a modern AI chat workspace built with Next.js, React 19, Prisma, Clerk, and the Vercel AI SDK. It is designed as a polished, multi-conversation chat app with streaming responses, persistent chat history, and a clean sidebar-based navigation flow.

## Overview

The app starts by creating a new conversation on the home route and redirecting the user into that thread. Authenticated users get a protected chat shell with a collapsible sidebar, conversation management, theme switching, and a message composer that supports streaming AI replies.

## Features

- Multi-conversation chat history with create, rename, pin, and delete actions.
- Streaming AI responses powered by the Vercel AI SDK and OpenAI.
- Built-in `searchWeb` tool for lightweight real-time web search using DuckDuckGo Lite.
- Clerk authentication with automatic user onboarding and database sync.
- Sidebar-based chat navigation with active conversation highlighting.
- Light and dark theme support.
- Markdown-style message rendering with loading states and tool-result previews.
- Responsive layout that works on desktop and mobile.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS v4, PostCSS
- UI: Base UI, Radix UI, Shadcn-style components, Lucide icons
- State and data: TanStack Query, Prisma ORM
- Auth: Clerk
- AI: Vercel AI SDK with OpenAI integration
- Database: PostgreSQL

## Project Structure

```text
chai-gpt-build-master/
├── app/                  # App Router pages, layouts, and API routes
├── components/           # Shared UI primitives and providers
├── features/             # Feature-based modules for auth, chat, AI, and home
├── lib/                  # Shared utilities and database setup
└── prisma/               # Prisma schema and migrations
```

## Getting Started

### Prerequisites

- Bun 1.x or Node.js 20+
- A PostgreSQL database
- Clerk project credentials
- OpenAI API key

### Install Dependencies

```bash
bun install
```

If you prefer npm, use `npm install` instead.

### Environment Variables

Create a `.env` file in the project root and add your database and AI credentials:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require"
OPENAI_API_KEY="your-openai-api-key"
```

Create a `.env.local` file for Clerk configuration:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Database Setup

Generate the Prisma client and apply the initial migration:

```bash
bunx prisma generate
bunx prisma migrate dev --name init
```

### Run Locally

```bash
bun dev
```

Open http://localhost:3000 in your browser to start a new chat.

## Scripts

```bash
bun dev     # Start the development server
bun build   # Build the production app
bun start   # Run the production server
bun lint    # Run ESLint
```

## Deployment

For Vercel deployment:

1. Push the repository to your Git provider.
2. Import the project into Vercel.
3. Set the build command to `bunx prisma generate && next build`.
4. Add the environment variables from `.env` and `.env.local` in the Vercel dashboard.
5. Run production migrations with `bunx prisma migrate deploy`.

## Notes

- The root route creates a fresh conversation and redirects to `/c/[id]`.
- The authenticated chat shell lives under the protected app layout.
- Message input uses Enter to send and Shift+Enter for a new line.
- The assistant can call a lightweight web search tool when it needs current information.

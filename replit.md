# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2)

## Artifacts

### mysticism-web (React + Vite, `previewPath: /`)
Vietnamese mysticism website "Huyền Bí" with 5 pages:
- `/` — Trang chủ (home)
- `/than-so-hoc` — Thần số học (Numerology): computes Life Path, Soul, Destiny, Personality numbers
- `/bat-tu` — Bát tự Tứ Trụ: computes 4 pillars (Year/Month/Day/Hour) + Ngũ Hành analysis
- `/xem-que` — Xem quẻ I Ching: animated coin-toss UI, reveals 1 of 64 hexagrams with AI insight
- `/ai-chat` — Trợ lý AI: full chat interface with OpenAI conversation history

### api-server (Express 5, `previewPath: /api`)
REST API with:
- `/api/healthz` — Health check
- `/api/openai/conversations` — AI chat conversation management (CRUD)
- `/api/openai/conversations/:id/messages` — SSE streaming chat with OpenAI (Vietnamese mysticism system prompt)
- `/api/mysticism/ai-interpret` — SSE streaming AI interpretation for numerology/batu/iching readings

## OpenAI Integration
Uses Replit AI Integrations (no user API key required). Model: `gpt-5.2`.
- `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` are auto-configured.

## Database Tables
- `conversations` — AI chat conversation sessions
- `messages` — individual chat messages (user/assistant)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

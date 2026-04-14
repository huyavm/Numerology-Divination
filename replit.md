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
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2); supports OpenAI GPT-5.4 and Gemini 3.1 via user-provided keys

## Artifacts

### mysticism-web (React + Vite, `previewPath: /`)
Vietnamese mysticism website "Huyền Bí" with 7 modules:
- `/` — Trang chủ redesigned hero + module cards + footer
- `/than-so-hoc` — Thần Số Học: Life Path, Soul, Destiny, Personality + export PNG/TXT
- `/bat-tu` — Bát Tự Tứ Trụ: 4 pillars + Ngũ Hành analysis + export PNG/TXT
- `/xem-que` — Kinh Dịch I Ching: 64 hexagrams + export PNG/TXT
- `/cat-hung` — Cát Hung phong thủy: phone/plate number analysis
- `/lich-van-nien` — Lịch Vạn Niên: lunar calendar, Can Chi, Hoàng Đạo/Hắc Đạo
- `/tu-vi` — Tử Vi Đẩu Số: 12 palaces + stars + export PNG/TXT
- `/ai-chat` — Trợ lý AI: chat with suggested questions + sidebar toggle

### Key frontend features
- **Light/Dark mode**: ThemeProvider + toggle button in navbar; saves to localStorage (`huyen-bi-theme`)
- **Export PNG/TXT**: html2canvas-based image export cards with dark branded design; applies to Thần Số Học, Bát Tự, Xem Quẻ, Tử Vi
- **AI provider selection**: Default Replit / OpenAI GPT-5.4 / Gemini 3.1; key + model stored in localStorage (`huyen-bi-ai-settings`)
- **History system**: `src/lib/history.ts` — localStorage-backed, max 50 entries (`huyen-bi-history`)
- **ResultActions**: Copy/Share/Print/Save component reusable across all pages
- **SEO + PWA**: Full meta tags, Open Graph, manifest.json, theme-color
- **Mobile responsive navbar**: hamburger menu + all nav links

### api-server (Express 5, `previewPath: /api`)
REST API with:
- `/api/healthz` — Health check
- `/api/openai/conversations` — AI chat CRUD
- `/api/openai/conversations/:id/messages` — SSE streaming chat
- `/api/mysticism/ai-interpret` — SSE streaming AI interpretation (numerology/batu/iching/tu-vi)

## Key Libraries
- `html2canvas` — DOM-to-image capture for export cards (mysticism-web)
- AI headers: `x-ai-provider`, `x-ai-key`, `x-ai-model`

## Key lib files
- `src/lib/lunar-calendar.ts` — Solar↔Lunar conversion (Ho Ngoc Duc algorithm, UTC+7)
- `src/lib/tu-vi.ts` — Tử Vi 12 palace calculation with stars
- `src/lib/history.ts` — localStorage history management
- `src/lib/numerology.ts`, `batu.ts`, `iching.ts`, `cat-hung.ts`
- `src/hooks/use-export-image.ts` — html2canvas download hook
- `src/hooks/use-ai-sse-chat.ts` — SSE streaming hook with provider/key/model headers
- `src/contexts/theme.tsx` — ThemeProvider (light/dark)
- `src/contexts/ai-settings.tsx` — AI provider settings context

## OpenAI Integration
Uses Replit AI Integrations (no user API key required). Model: `gpt-5.2`.
- `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` are auto-configured.

## Database Tables
- `conversations` — AI chat conversation sessions
- `messages` — individual chat messages (user/assistant)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

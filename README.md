# Huyền Bí — Ứng dụng Huyền Học Việt Nam

> Nền tảng huyền học toàn diện: Thần số học, Bát Tự Tứ Trụ, Kinh Dịch I Ching, Cát Hung, Lịch Vạn Niên, Tử Vi Đẩu Số và Trợ lý AI — giao diện tiếng Việt, chủ đề huyền bí tối màu.

![Huyền Bí](https://img.shields.io/badge/Huy%E1%BB%81n%20B%C3%AD-v1.0-c9a227?style=for-the-badge&labelColor=0d0818)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Kiến trúc](#kiến-trúc)
- [Cài đặt](#cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API](#api)
- [Xuất kết quả](#xuất-kết-quả)
- [AI Provider](#ai-provider)
- [Đóng góp](#đóng-góp)

---

## Giới thiệu

**Huyền Bí** là ứng dụng web huyền học Việt Nam đầy đủ tính năng, bao gồm 7 mô-đun tra cứu từ thần số học, tử vi đẩu số đến lịch âm dương vạn niên. Toàn bộ giao diện bằng tiếng Việt, thiết kế chủ đề tối huyền bí (indigo sâu + vàng cổ điển), hỗ trợ xuất kết quả ra file PNG/TXT và tích hợp trợ lý AI phân tích.

---

## Tính năng

### 7 Mô-đun tra cứu

| Mô-đun | Đường dẫn | Mô tả |
|--------|-----------|-------|
| **Thần Số Học** | `/than-so-hoc` | Tính số Đường đời, Linh hồn, Sứ mệnh, Nhân cách từ tên và ngày sinh |
| **Bát Tự Tứ Trụ** | `/bat-tu` | Lập lá số Tứ Trụ (Năm–Tháng–Ngày–Giờ), phân tích Ngũ Hành vượng/suy |
| **Xem Quẻ I Ching** | `/xem-que` | Gieo quẻ Kinh Dịch ngẫu nhiên hoặc theo số, luận giải 64 quẻ |
| **Cát Hung** | `/cat-hung` | Phân tích số điện thoại và biển số xe theo phong thủy |
| **Lịch Vạn Niên** | `/lich-van-nien` | Tra cứu ngày âm lịch, Can Chi, giờ Hoàng Đạo/Hắc Đạo; phạm vi 1900–2100 |
| **Tử Vi Đẩu Số** | `/tu-vi` | Lập lá số Tử Vi 12 cung, xác định 14 chính tinh và Mệnh Cục |
| **Trợ lý AI** | `/ai-chat` | Chat huyền học với AI, lưu lịch sử hội thoại, gợi ý câu hỏi mẫu |

### Tính năng chung

- **Chủ đề Sáng/Tối** — Chuyển đổi Light/Dark mode, lưu vào localStorage
- **Xuất PNG & TXT** — Tải về ảnh kết quả chất lượng cao (2× retina) hoặc file văn bản
- **Phân tích AI** — Giải nghĩa kết quả bằng AI với streaming SSE
- **Lịch sử tra cứu** — Lưu tối đa 50 mục tra cứu gần nhất vào localStorage
- **Responsive** — Tương thích mobile, tablet và desktop
- **PWA-ready** — Có `manifest.json`, meta tags, Open Graph

---

## Kiến trúc

```
monorepo (pnpm workspaces)
├── artifacts/
│   ├── mysticism-web/     # React + Vite frontend (port $PORT)
│   └── api-server/        # Express 5 backend (port $PORT)
├── packages/
│   ├── db/                # Drizzle ORM schema + migrations
│   └── api-spec/          # OpenAPI spec + Orval codegen
└── README.md
```

- **Frontend**: React 19 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express 5 + Drizzle ORM + PostgreSQL + Zod validation
- **AI**: Hỗ trợ OpenAI, Google Gemini và Replit AI Integrations (mặc định)
- **Export**: html2canvas — render DOM ra canvas rồi download PNG

---

## Cài đặt

### Yêu cầu

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | 20+ |
| pnpm | 10+ |
| PostgreSQL | 14+ |

### Bước 1 — Clone repo

```bash
git clone https://github.com/huyavm/Numerology-Divination.git
cd Numerology-Divination
```

### Bước 2 — Cài dependencies

```bash
pnpm install
```

### Bước 3 — Tạo database

```bash
# Tạo database PostgreSQL
createdb huyenbi

# Đẩy schema lên database
pnpm --filter @workspace/db run push
```

---

## Cấu hình môi trường

Tạo file `.env` tại thư mục gốc (hoặc set trực tiếp trong shell):

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/huyenbi

# AI — chỉ cần nếu dùng Replit AI Integrations
AI_INTEGRATIONS_OPENAI_BASE_URL=https://...
AI_INTEGRATIONS_OPENAI_API_KEY=...

# Port cho từng service (tuỳ chỉnh nếu cần)
# Mặc định: api-server=3001, mysticism-web=5173
PORT=3001   # cho api-server
PORT=5173   # cho mysticism-web
```

> **Lưu ý**: Nếu bạn không dùng Replit AI Integrations, vẫn có thể dùng ứng dụng bình thường. Người dùng có thể nhập API key OpenAI hoặc Google Gemini trực tiếp trong giao diện cài đặt AI (biểu tượng AI trên navbar).

---

## Chạy ứng dụng

### Chế độ Development

```bash
# Chạy cả frontend và backend song song
pnpm run dev

# Hoặc chạy riêng từng service
pnpm --filter @workspace/api-server run dev    # Backend: http://localhost:3001
pnpm --filter @workspace/mysticism-web run dev # Frontend: http://localhost:5173
```

### Chế độ Production

```bash
# Build toàn bộ
pnpm run build

# Chạy backend sau khi build
node artifacts/api-server/dist/index.js
```

---

## Cấu trúc thư mục

```
artifacts/mysticism-web/src/
├── pages/
│   ├── home.tsx             # Trang chủ
│   ├── than-so-hoc.tsx      # Thần Số Học
│   ├── bat-tu.tsx           # Bát Tự Tứ Trụ
│   ├── xem-que.tsx          # Xem Quẻ I Ching
│   ├── cat-hung.tsx         # Cát Hung
│   ├── lich-van-nien.tsx    # Lịch Vạn Niên
│   ├── tu-vi.tsx            # Tử Vi Đẩu Số
│   └── ai-chat.tsx          # Trợ lý AI
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── ui/                  # shadcn/ui components
│   ├── knowledge-base.tsx   # Accordion tra cứu kiến thức
│   ├── export-card-*.tsx    # Thẻ xuất PNG cho từng mô-đun
│   ├── export-download-bar.tsx
│   └── result-actions.tsx
├── lib/
│   ├── lunar-calendar.ts    # Chuyển đổi Dương↔Âm lịch (thuật toán Ho Ngoc Duc)
│   ├── tu-vi.ts             # Tính toán 12 cung Tử Vi + 14 chính tinh
│   ├── numerology.ts        # Công thức Thần Số Học
│   ├── batu.ts              # Bát Tự + Ngũ Hành
│   ├── iching.ts            # 64 quẻ Kinh Dịch
│   ├── cat-hung.ts          # Phân tích số Cát Hung
│   └── history.ts           # Quản lý lịch sử localStorage
├── hooks/
│   ├── use-export-image.ts  # html2canvas download hook
│   └── use-ai-sse-chat.ts   # SSE streaming với AI
└── contexts/
    ├── theme.tsx            # ThemeProvider Light/Dark
    └── ai-settings.tsx      # AI provider context

artifacts/api-server/src/
├── routes/
│   ├── ai.ts                # SSE chat + AI interpret endpoints
│   └── conversations.ts     # CRUD hội thoại AI
└── index.ts                 # Express app entry
```

---

## API

Base URL: `http://localhost:3001`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/healthz` | Kiểm tra server |
| `GET` | `/api/openai/conversations` | Danh sách hội thoại AI |
| `POST` | `/api/openai/conversations` | Tạo hội thoại mới |
| `GET` | `/api/openai/conversations/:id/messages` | Tin nhắn trong hội thoại |
| `POST` | `/api/openai/conversations/:id/messages` | Gửi tin nhắn (SSE streaming) |
| `POST` | `/api/mysticism/ai-interpret` | Phân tích huyền học bằng AI (SSE streaming) |

### Headers cho AI tùy chỉnh

Khi gọi API với AI provider riêng, truyền thêm headers:

```
x-ai-provider: openai | gemini | replit
x-ai-key: <API key của bạn>
x-ai-model: gpt-5.4 | gemini-2.5-pro | ...
```

---

## Xuất kết quả

Các trang **Thần Số Học**, **Bát Tự**, **Xem Quẻ** và **Tử Vi** hỗ trợ xuất kết quả:

- **PNG** — Ảnh chất lượng cao (tỷ lệ 2×) với thiết kế thương hiệu đen/vàng, phông chữ hỗ trợ tiếng Việt đầy đủ dấu
- **TXT** — File văn bản thuần túy, dễ chia sẻ và lưu trữ

Kỹ thuật xuất sử dụng `html2canvas` với card ẩn ngoài màn hình, áp dụng Flexbox và màu inline để tránh lỗi render dấu tiếng Việt.

---

## AI Provider

Ứng dụng hỗ trợ 3 nhà cung cấp AI:

| Provider | Model mặc định | Cần API key? |
|----------|---------------|-------------|
| **Replit AI** | gpt-5.2 | Không (tự động khi deploy trên Replit) |
| **OpenAI** | gpt-5.4 | Có — nhập trong giao diện |
| **Google Gemini** | gemini-2.5-pro | Có — nhập trong giao diện |

Cài đặt AI được lưu vào localStorage với key `huyen-bi-ai-settings`.

---

## Docker

### Yêu cầu
- Docker 24+
- Docker Compose v2+

### Cấu trúc Docker

```
docker-compose.yml
├── postgres    — PostgreSQL 16 (lưu trữ hội thoại AI)
├── api         — Express 5 backend (Dockerfile.api)
│                 Build: esbuild bundle → dist/index.mjs
└── web         — Nginx 1.27 (Dockerfile.web)
                  Build: Vite → static files
                  Proxy: /api/* → api:3001
```

### Chạy nhanh

```bash
# 1. Clone repo
git clone https://github.com/huyavm/Numerology-Divination.git
cd Numerology-Divination

# 2. Tạo file .env từ mẫu
cp .env.example .env
# Chỉnh sửa .env nếu cần (mật khẩu database, API keys, ...)

# 3. Build và khởi động tất cả service
docker compose up --build -d

# 4. Chạy migration database (chỉ lần đầu)
# Chạy từ máy local với DATABASE_URL trỏ vào postgres container:
DATABASE_URL=postgresql://huyenbi:huyenbi_secret@localhost:5432/huyenbi \
  pnpm --filter @workspace/db run push
```

> Mở trình duyệt: **http://localhost**

### Lệnh thường dùng

```bash
# Xem log real-time
docker compose logs -f

# Xem log từng service
docker compose logs -f api
docker compose logs -f web

# Restart 1 service (sau khi thay đổi code)
docker compose up --build -d api
docker compose up --build -d web

# Dừng tất cả
docker compose down

# Dừng và xoá toàn bộ data (cẩn thận!)
docker compose down -v
```

### Biến môi trường quan trọng

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `POSTGRES_DB` | `huyenbi` | Tên database |
| `POSTGRES_USER` | `huyenbi` | Username PostgreSQL |
| `POSTGRES_PASSWORD` | `huyenbi_secret` | Mật khẩu PostgreSQL |
| `WEB_PORT` | `80` | Cổng web expose ra ngoài |
| `OPENAI_API_KEY` | *(trống)* | OpenAI API key (tuỳ chọn) |
| `GEMINI_API_KEY` | *(trống)* | Google Gemini API key (tuỳ chọn) |

### Thay đổi port

Nếu cổng 80 đã bị chiếm:

```bash
# Trong .env
WEB_PORT=8080

# Hoặc ghi đè trực tiếp
WEB_PORT=8080 docker compose up -d
```

### Chạy sau reverse proxy (Nginx/Traefik)

Nếu đã có reverse proxy phía trước, chỉ cần expose cổng 80 nội bộ:

```yaml
# docker-compose.override.yml
services:
  web:
    ports: []          # Bỏ expose cổng trực tiếp
    expose:
      - "80"           # Chỉ expose nội bộ cho reverse proxy
```

---

## Đóng góp

1. Fork repo này
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m "Thêm tính năng X"`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## Giấy phép

MIT License — xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

*Được xây dựng với tâm huyết cho cộng đồng huyền học Việt Nam.*

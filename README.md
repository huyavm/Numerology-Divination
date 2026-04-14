# Huyền Bí — Ứng dụng Huyền Học Việt Nam

> Nền tảng huyền học toàn diện: Thần số học, Bát Tự Tứ Trụ, Kinh Dịch I Ching, Cát Hung, Lịch Vạn Niên, Tử Vi Đẩu Số và Trợ lý AI — giao diện tiếng Việt, chủ đề tối huyền bí.

![Huyền Bí](https://img.shields.io/badge/Huy%E1%BB%87n%20B%C3%AD-v2.0-c9a227?style=for-the-badge&labelColor=0d0818)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Kiến trúc](#kiến-trúc)
- [Cài lên server thông thường](#cài-lên-server-thông-thường)
- [Cài bằng Docker](#cài-bằng-docker)
- [Cấu hình AI (Admin Panel)](#cấu-hình-ai-admin-panel)
- [API](#api)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)

---

## Giới thiệu

**Huyền Bí** là ứng dụng web huyền học Việt Nam đầy đủ tính năng, gồm 7 mô-đun tra cứu, trợ lý AI hỗ trợ streaming, và hệ thống quản trị key AI dùng chung với giới hạn lượt gọi theo IP.

---

## Tính năng

### 7 Mô-đun tra cứu

| Mô-đun | Đường dẫn | Mô tả |
|--------|-----------|-------|
| **Thần Số Học** | `/than-so-hoc` | Số Đường đời, Linh hồn, Sứ mệnh, Nhân cách |
| **Bát Tự Tứ Trụ** | `/bat-tu` | 4 trụ Năm–Tháng–Ngày–Giờ, phân tích Ngũ Hành |
| **Xem Quẻ I Ching** | `/xem-que` | 64 quẻ Kinh Dịch, gieo quẻ và luận giải |
| **Cát Hung** | `/cat-hung` | Phân tích số điện thoại, biển số xe |
| **Lịch Vạn Niên** | `/lich-van-nien` | Âm lịch, Can Chi, Hoàng Đạo/Hắc Đạo (1900–2100) |
| **Tử Vi Đẩu Số** | `/tu-vi` | 12 cung Tử Vi, 14 chính tinh, Mệnh Cục |
| **Trợ lý AI** | `/ai-chat` | Chat huyền học với AI, lưu lịch sử hội thoại |

### Tính năng chung

- **Chủ đề Sáng/Tối** — Light/Dark mode, lưu localStorage
- **Xuất PNG & TXT** — Ảnh chất lượng cao 2× retina hoặc file văn bản
- **Phân tích AI** — Giải nghĩa kết quả bằng AI với streaming SSE
- **Key AI dùng chung** — Admin cấu hình key qua giao diện web, có giới hạn lượt gọi theo IP
- **Responsive** — Tương thích mobile, tablet, desktop

---

## Kiến trúc

```
monorepo (pnpm workspaces)
├── artifacts/
│   ├── mysticism-web/     # React 19 + Vite 6 frontend
│   └── api-server/        # Express 5 backend
├── docker/
│   └── nginx.conf         # Nginx reverse proxy config
├── Dockerfile.api
├── Dockerfile.web
└── docker-compose.yml
```

- **Frontend**: React 19 + Vite 6 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express 5 + PostgreSQL + Zod validation
- **AI**: OpenAI (GPT) hoặc Google Gemini — key dùng chung (lưu DB) hoặc key riêng của người dùng
- **DB**: PostgreSQL — lưu hội thoại AI, cấu hình admin, log lượt gọi AI
- **Migration**: Tự động chạy khi server khởi động, không cần thao tác thủ công

---

## Cài lên server thông thường

Phù hợp khi bạn đã có server Linux/macOS với Node.js và PostgreSQL.

### Yêu cầu

| Công cụ | Phiên bản |
|---------|-----------|
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

### Bước 3 — Tạo database PostgreSQL

```bash
# Tạo database (đăng nhập vào psql trước nếu cần)
psql -U postgres -c "CREATE DATABASE huyenbi;"
psql -U postgres -c "CREATE USER huyenbi WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE huyenbi TO huyenbi;"
```

### Bước 4 — Tạo file .env

```bash
cp .env.example .env
```

Mở `.env` và điền `DATABASE_URL`:

```env
DATABASE_URL=postgresql://huyenbi:your_password@localhost:5432/huyenbi
PORT_API=3001
PORT_WEB=5173
```

> Các bảng database sẽ được tạo tự động khi backend khởi động lần đầu.

### Bước 5 — Build

```bash
# Build backend (esbuild → dist/)
pnpm --filter @workspace/api-server run build

# Build frontend (Vite → dist/public/)
pnpm --filter @workspace/mysticism-web run build
```

### Bước 6 — Chạy production

#### Cách 1: Dùng PM2 (khuyến nghị)

```bash
npm install -g pm2

# Chạy backend
PORT=3001 DATABASE_URL=<your-db-url> \
  pm2 start artifacts/api-server/dist/index.mjs \
  --name huyen-bi-api

# Chạy frontend (serve static files)
npm install -g serve
pm2 start "serve -s artifacts/mysticism-web/dist/public -l 5173" \
  --name huyen-bi-web

# Lưu để tự khởi động lại khi reboot
pm2 save
pm2 startup
```

#### Cách 2: Dùng systemd (Ubuntu/Debian)

Tạo file `/etc/systemd/system/huyen-bi-api.service`:

```ini
[Unit]
Description=Huyen Bi API Server
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/Numerology-Divination
ExecStart=/usr/bin/node artifacts/api-server/dist/index.mjs
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=DATABASE_URL=postgresql://huyenbi:your_password@localhost:5432/huyenbi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable huyen-bi-api
sudo systemctl start huyen-bi-api
```

#### Cách 3: Nginx làm reverse proxy cho frontend + API

Thêm config Nginx `/etc/nginx/sites-available/huyenbi`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/Numerology-Divination/artifacts/mysticism-web/dist/public;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|woff2?|png|jpg|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Proxy API — hỗ trợ SSE streaming
    location /api/ {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Connection "";
        proxy_buffering    off;
        proxy_cache        off;
        chunked_transfer_encoding on;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/huyenbi /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Cài bằng Docker

Phù hợp để triển khai nhanh — một lệnh là chạy cả stack (Postgres + API + Nginx).

### Yêu cầu

- Docker 24+
- Docker Compose v2+

### Cấu trúc Docker

```
docker-compose.yml
├── postgres    — PostgreSQL 16 (lưu trữ dữ liệu)
├── api         — Express 5 backend (Dockerfile.api)
│                 Build: esbuild → dist/index.mjs
│                 Migration DB chạy tự động khi khởi động
└── web         — Nginx 1.27 (Dockerfile.web)
                  Build: Vite → static files
                  Proxy: /api/* → api:3001
```

### Bước 1 — Clone repo

```bash
git clone https://github.com/huyavm/Numerology-Divination.git
cd Numerology-Divination
```

### Bước 2 — Tạo file .env

```bash
cp .env.example .env
```

Chỉnh sửa `.env` — tối thiểu đổi mật khẩu database:

```env
POSTGRES_PASSWORD=mat_khau_manh_cua_ban
WEB_PORT=80
```

> Không cần điền API key AI ở đây — key AI được cấu hình qua Admin Panel trong giao diện web sau khi deploy.

### Bước 3 — Build và chạy

```bash
docker compose up --build -d
```

Mở trình duyệt: **http://localhost** (hoặc `http://your-server-ip`)

> Lần đầu build mất 3–5 phút. Các lần sau nhanh hơn nhờ Docker layer cache.

### Lệnh thường dùng

```bash
# Xem log real-time tất cả service
docker compose logs -f

# Xem log từng service
docker compose logs -f api
docker compose logs -f web
docker compose logs -f postgres

# Rebuild và restart sau khi thay đổi code
docker compose up --build -d

# Chỉ rebuild một service
docker compose up --build -d api

# Dừng tất cả (giữ data)
docker compose down

# Dừng và xoá toàn bộ data (cẩn thận!)
docker compose down -v
```

### Thay đổi port

Nếu cổng 80 đã bị chiếm, sửa trong `.env`:

```env
WEB_PORT=8080
```

### Chạy sau reverse proxy (Nginx/Traefik sẵn có)

```yaml
# docker-compose.override.yml
services:
  web:
    ports: []
    expose:
      - "80"
```

---

## Cấu hình AI (Admin Panel)

Ứng dụng hỗ trợ **3 chế độ AI**:

| Chế độ | Mô tả | Ai cần cấu hình? |
|--------|-------|-----------------|
| **Key hệ thống** | Dùng key chung do admin cài — người dùng không cần nhập gì | Admin |
| **OpenAI** | Người dùng tự nhập OpenAI API key | Người dùng |
| **Google Gemini** | Người dùng tự nhập Gemini API key | Người dùng |

### Cách cấu hình Key hệ thống (Admin)

1. Vào ứng dụng → nhấn nút **AI** trên thanh điều hướng
2. Nhấn **Cài đặt AI** → cuộn xuống phần **Cài đặt Admin**
3. Nhập mật khẩu admin *(lần đầu nhập bất kỳ mật khẩu nào → tự đặt làm mật khẩu admin)*
4. Chọn **Provider** (OpenAI hoặc Gemini), nhập **API Key**, chọn **Model**
5. Đặt **giới hạn lượt gọi theo IP** (mặc định: 20/giờ, 100/ngày)
6. Nhấn **Lưu cấu hình Admin**

Sau khi cấu hình, tất cả người dùng có thể chọn **Key hệ thống** mà không cần nhập key riêng.

### Các model được hỗ trợ

| Provider | Model mặc định | Các model khác |
|----------|---------------|----------------|
| OpenAI | `gpt-4.1` | `gpt-4.1-mini`, `gpt-4o`, `gpt-4o-mini` |
| Google Gemini | `gemini-2.5-pro` | `gemini-2.0-flash`, `gemini-1.5-pro` |

---

## API

Base URL: `http://localhost:3001`

### Endpoints chính

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/healthz` | Kiểm tra server |
| `GET` | `/api/config/public` | Thông tin cấu hình public (server có key không, rate limit) |
| `POST` | `/api/admin/config` | Cập nhật cấu hình admin (cần mật khẩu) |
| `GET` | `/api/admin/usage` | Thống kê lượt gọi AI theo IP |
| `GET` | `/api/openai/conversations` | Danh sách hội thoại AI |
| `POST` | `/api/openai/conversations` | Tạo hội thoại mới |
| `GET` | `/api/openai/conversations/:id/messages` | Tin nhắn trong hội thoại |
| `POST` | `/api/openai/conversations/:id/messages` | Gửi tin nhắn (SSE streaming) |
| `POST` | `/api/mysticism/ai-interpret` | Phân tích huyền học bằng AI (SSE streaming) |

### Headers AI

```
x-ai-provider: server | openai | gemini
x-ai-key: <API key của bạn>      (chỉ khi dùng openai/gemini)
x-ai-model: gpt-4.1 | gemini-2.5-pro | ...
```

---

## Cấu trúc thư mục

```
artifacts/mysticism-web/src/
├── pages/               # Các trang (home, than-so-hoc, bat-tu, ...)
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── ui/              # shadcn/ui components
│   └── export-card-*.tsx
├── lib/
│   ├── lunar-calendar.ts   # Chuyển đổi Dương↔Âm (Ho Ngoc Duc)
│   ├── tu-vi.ts            # 12 cung Tử Vi + 14 chính tinh
│   ├── numerology.ts       # Thần Số Học
│   ├── batu.ts             # Bát Tự + Ngũ Hành
│   ├── iching.ts           # 64 quẻ Kinh Dịch
│   └── cat-hung.ts         # Phân tích Cát Hung
└── contexts/
    ├── theme.tsx            # Light/Dark mode
    └── ai-settings.tsx      # AI provider context

artifacts/api-server/src/
├── lib/
│   ├── migrate.ts       # Auto-migration các bảng DB khi khởi động
│   ├── server-config.ts # Đọc/ghi cấu hình từ DB
│   └── rate-limit.ts    # Kiểm tra + ghi log rate limit theo IP
└── routes/
    ├── mysticism/       # SSE AI interpret
    ├── conversations/   # CRUD hội thoại
    ├── config/          # /api/config/public
    └── admin/           # /api/admin/config, /api/admin/usage
```

---

## Giấy phép

MIT License

---

*Được xây dựng với tâm huyết cho cộng đồng huyền học Việt Nam.*

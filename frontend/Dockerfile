# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY postcss.config.mjs ./
# COPY tailwind.config.js ./
COPY public ./public
COPY app ./app

RUN npm install
RUN npm run build

# 2. Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# อาจต้อง copy ไฟล์ tailwind.config.js/postcss.config.mjs ถ้าต้องใช้กับ runtime
# COPY --from=builder /app/tailwind.config.js ./tailwind.config.js
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "start"]

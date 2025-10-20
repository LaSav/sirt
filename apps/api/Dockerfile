# Build
FROM node:20-slim AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build


# Runtime
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN corepack enable && pnpm i --prod
EXPOSE 4000
CMD ["node", "dist/server.js"]
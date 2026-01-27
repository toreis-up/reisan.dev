FROM node:24.11.1-bullseye-slim AS base
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY . .
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile

# ---

FROM base AS develop

CMD ["pnpm", "dev"]
# ---

FROM base AS build

RUN pnpm build
# FIXME: please optimize me

# ---

FROM node:24.11.1-bullseye-slim AS prod-env
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --from=build /app/dist ./dist

# ---

FROM gcr.io/distroless/nodejs20-debian12 AS runtime
WORKDIR /app

COPY --from=prod-env /app .
CMD ["./node_modules/.bin/vite", "preview", "--host"]
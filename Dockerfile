FROM node:20.9.0-bullseye-slim AS base
WORKDIR /app

COPY package.json yarn.lock ./
COPY . .
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile

# ---

FROM base AS develop

CMD ["yarn", "dev"]

# ---

FROM base AS build

RUN yarn build
# FIXME: please optimize me

# ---

FROM node:20.9.0-bullseye-slim AS prod-env
WORKDIR /app

COPY package.json yarn.lock ./
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --ignore-scripts

COPY --from=build /app/dist ./dist

# ---

FROM gcr.io/distroless/nodejs20-debian12 AS runtime
WORKDIR /app

COPY --from=prod-env /app .
CMD ["./node_modules/.bin/vite", "preview", "--host"]
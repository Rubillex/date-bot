ARG NODE_VERSION=24.15.0

FROM node:${NODE_VERSION}-slim as base

ENV PORT=3000

WORKDIR /app

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Build
FROM base as build

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install --production=false

COPY . .

RUN npm run build

# Run
FROM base

COPY --from=build /app /app

CMD  [ "npm", "run", "start" ]

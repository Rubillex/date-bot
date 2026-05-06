ARG NODE_VERSION=24.15.0

FROM node:${NODE_VERSION}-slim as base

ENV PORT=3000

WORKDIR /app

# Build
FROM base as build

COPY package*.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

# Run
FROM base

COPY --from=build /app /app

CMD  [ "npm", "run", "start" ]

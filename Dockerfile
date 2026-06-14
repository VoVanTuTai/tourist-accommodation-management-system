FROM node:20-bookworm-slim AS dependencies

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libcairo2-dev \
        libgif-dev \
        libjpeg62-turbo-dev \
        libpango1.0-dev \
        librsvg2-dev \
        python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libcairo2 \
        libgif7 \
        libjpeg62-turbo \
        libpango-1.0-0 \
        librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

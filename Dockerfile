# builder : Build the production application
# runner  : Final production image

FROM oven/bun:1-slim AS builder
WORKDIR /app
ENV ADAPTER=exe

RUN apt-get update && \
    apt-get install -y --no-install-recommends git-core && \
    rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock .
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build -m production

FROM gcr.io/distroless/base-nossl AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist/cofund .

EXPOSE 3000/tcp
ENTRYPOINT ["/app/cofund"]

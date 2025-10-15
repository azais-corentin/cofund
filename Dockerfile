# devcontainer     : Development container with necessary tools
# production-build : Build the production application
# production       : Final production image

FROM mcr.microsoft.com/devcontainers/base:debian AS devcontainer

RUN apt-get update \
    && apt-get -y --no-install-recommends install \
    sudo curl git ca-certificates build-essential \
    && rm -rf /var/lib/apt/lists/*

USER vscode

# Install mise
RUN curl https://mise.run/bash | sh
RUN echo 'eval "$(mise activate bash)"' >> ~/.bashrc
# Install bun, dprint
RUN ~/.local/bin/mise use -g bun github:dprint/dprint

FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock .
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM gcr.io/distroless/base:nonroot AS runner

WORKDIR /app

COPY --from=builder /app/dist/cofund .

ENV NODE_ENV=production
EXPOSE 3000/tcp
ENTRYPOINT ["/app/cofund"]

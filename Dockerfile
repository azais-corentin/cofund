# devcontainer     : Development container with necessary tools
# production-build : Build the production application
# production       : Final production image

FROM mcr.microsoft.com/devcontainers/base:debian AS devcontainer

RUN apt-get update  \
    && apt-get -y --no-install-recommends install  \
    # install any other dependencies you might need
    sudo curl git ca-certificates build-essential \
    && rm -rf /var/lib/apt/lists/*

USER vscode

ENV MISE_DATA_DIR="/mise"
ENV MISE_CONFIG_DIR="/mise"
ENV MISE_CACHE_DIR="/mise/cache"
ENV MISE_INSTALL_PATH="/usr/local/bin/mise"
ENV PATH="/mise/shims:$PATH"
RUN curl https://mise.run | sh
RUN echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc

RUN mise use -g bun github:dprint/dprint

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
ENTRYPOINT [ "/app/cofund" ]
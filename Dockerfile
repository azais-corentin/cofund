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
# Install tools via mise
RUN ~/.local/bin/mise use -g usage shfmt rg bun github:dprint/dprint github:sst/opencode
RUN mkdir -p ~/.local/share/bash-completion/completions/ && \
    ~/.local/bin/mise exec -- usage generate c bash mise --usage-cmd "mise usage" --include-bash-completion-lib > ~/.local/share/bash-completion/completions/mise && \
    ~/.local/bin/mise exec -- dprint completions bash > ~/.local/share/bash-completion/completions/dprint
RUN ~/.local/bin/mise settings experimental=true

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

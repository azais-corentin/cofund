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

RUN curl https://mise.run | sh
ENV PATH="/home/vscode/.local/bin:${PATH}"
RUN echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc

RUN mise use -g bun node@latest
RUN mise exec bun -- bun install -g @google/gemini-cli
ENV PATH="/home/vscode/.bun/bin:${PATH}"

FROM oven/bun:1 AS production-build

WORKDIR /app
COPY . /app

RUN bun install --frozen-lockfile && bun run build

FROM oven/bun:1-slim AS production

WORKDIR /app
COPY --from=production-build /app/build .

EXPOSE 3000
ENTRYPOINT [ "bun", "run", "/app/index.ts" ]
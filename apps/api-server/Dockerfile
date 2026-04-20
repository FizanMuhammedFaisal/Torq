FROM node:22.18.0

WORKDIR /app

COPY package.json package-lock.json* ./
# Mount a persistent cache to the root user's npm cache directory
# Use npm ci for faster, strictly lockfile-based installations
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

CMD ["npm", "run", "dev"]
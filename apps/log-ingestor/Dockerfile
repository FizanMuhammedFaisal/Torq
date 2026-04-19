FROM oven/bun:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb* bun.lock* ./
RUN bun install

COPY . .


CMD ["bun", "run", "dev"]
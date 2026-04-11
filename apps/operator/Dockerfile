FROM node:22.18.0

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb* ./
RUN npm install -g bun
RUN bun install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
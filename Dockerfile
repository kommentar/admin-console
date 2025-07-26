# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Enable corepack and set pnpm version
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nuxtjs:nodejs /app/.output ./

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Start the application
CMD ["node", "server/index.mjs"]

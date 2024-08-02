# Base image
FROM node:16-alpine AS base

# Set working directory
WORKDIR /app

# Stage for installing dependencies
FROM base AS deps

# Copy lock files and package.json
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies based on the lock file
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage for building the application
FROM base AS builder

# Set environment variable
ENV NODE_ENV production

# Copy application files
COPY . .

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Build the application
RUN npm run build

# Stage for running the application
FROM node:16-alpine AS runner

# Set environment variable
ENV NODE_ENV production

# Install `serve` globally to serve the build
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port that the app will run on
EXPOSE 3000

# Command to run the application
CMD ["serve", "-s", "dist"]
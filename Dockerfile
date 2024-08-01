# Use the official Node.js image as the base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Stage for installing dependencies
FROM base as deps

# Copy lock files and package.json
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

# Install dependencies based on the lock file
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Stage for building the application
FROM base as builder

# Set environment variable
ENV NODE_ENV production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Stage for running the application
FROM base as runner

# Set environment variable
ENV NODE_ENV production

# Install `serve` globally to serve the build
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Set the user to the node user
USER node

# Serve the built application on all network interfaces
CMD ["serve", "-s", "dist", "-l", "4173", "--host", "0.0.0.0"]

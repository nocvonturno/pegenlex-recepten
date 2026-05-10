# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (if it exists) to leverage Docker cache
# This ensures npm install only runs if dependencies change
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build

# Stage 2: Serve the static files with a lightweight server
FROM node:20-alpine AS serve

WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Expose the port that Vite's dev server (and 'serve' by default) uses
EXPOSE 3000

# Command to run the application using 'serve'
CMD ["serve", "-s", "dist", "-l", "3000"]
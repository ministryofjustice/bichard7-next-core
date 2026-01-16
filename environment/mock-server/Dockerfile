# Use a minimal, stable Node.js image (lts is the latest stable LTS branch)
FROM node:lts-slim

# Set the working directory inside the container
WORKDIR /app

# Install openssl and curl for certificate generation and health checks
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl curl \
    && rm -rf /var/lib/apt/lists/*

# Install necessary dependencies to run TypeScript directly (ts-node and typescript)
RUN npm install -g --ignore-scripts typescript ts-node

# Copy the server file and the entrypoint script
COPY mock-server.ts .
COPY mock-server.sh .

# Ensure the entrypoint script is executable
RUN chmod +x mock-server.sh

# Change ownership of /app to the non-root node user
RUN chown -R node:node /app

# Switch to the non-root node user for runtime
USER node

# Use the script as the entrypoint. This runs mock-server.sh first, 
# which generates certificates and then executes the mock server.
ENTRYPOINT ["/app/mock-server.sh"]
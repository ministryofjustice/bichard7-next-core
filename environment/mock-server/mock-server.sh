#!/bin/bash

# Configuration
KEY_FILE="key.pem"
CERT_FILE="cert.pem"

echo "Checking for SSL certificates..."

# Check if key.pem and cert.pem exist.
if [ ! -f "$KEY_FILE" ] || [ ! -f "$CERT_FILE" ]; then
    echo "Certificates not found. Generating self-signed SSL key and certificate..."
    
    # Generate a private key and a self-signed certificate.
    # The -subj option ensures non-interactive generation, and the Common Name (CN) is set to localhost.
    openssl req -newkey rsa:2048 -nodes -keyout "$KEY_FILE" -x509 -days 365 -out "$CERT_FILE" -subj "/CN=localhost"
    
    if [ $? -eq 0 ]; then
        echo "Successfully generated $KEY_FILE and $CERT_FILE."
    else
        echo "Error: Failed to generate SSL certificates using openssl."
        exit 1
    fi
else
    echo "Certificates found."
fi

echo "Starting TypeScript Mock Server..."

# Run the TypeScript server using ts-node
npx ts-node mock-server.ts
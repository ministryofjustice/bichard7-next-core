FROM node:lts-slim

WORKDIR /opt/s3-server/

# Install s3-server
COPY . /opt/s3-server/
RUN npm install --production

# Run the server
CMD sh bin/start.sh

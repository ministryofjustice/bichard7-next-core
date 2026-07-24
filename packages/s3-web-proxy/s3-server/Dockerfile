FROM quay.io/signalfuse/maestro-base:alp-3.2



MAINTAINER Ozan Turgut <ozan@signalfuse.com>



ENV DEBIAN_FRONTEND noninteractive



WORKDIR /opt/s3-server/



# Install node and socat

RUN apk-install nodejs socat



# Install s3-server

COPY . /opt/s3-server/

RUN npm install --production



# Keep RUN_CMD in sync with ENTRYPOINT and CMD or just use the wrapped shell with ENV VAR

ENV RUN_CMD="sh bin/start.sh"



# Run the server

CMD sh bin/start.sh 


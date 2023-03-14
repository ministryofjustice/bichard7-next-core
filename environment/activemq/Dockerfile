FROM symptoma/activemq:5.16.3

COPY activemq.xml /opt/activemq/conf/activemq.xml
COPY jolokia-access.xml /opt/activemq/webapps/api/WEB-INF/classes/jolokia-access.xml

RUN sed -i 's/127\.0\.0\.1/0.0.0.0/' conf/jetty.xml

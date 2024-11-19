const defaults = {
  awsRegion: "eu-west-2",
  awsUrl: "http://localhost:4566",
  db2Host: "localhost",
  db2Password: "TEST_DB2INST1_PASSWORD",
  db2Port: 50000,
  db2User: "db2inst1",
  enableCorePhase1: "false",
  ibmMqPassword: "passw0rd",
  ibmMqQmgr: "BR7_QM",
  ibmMqUrl: "localhost:10443",
  ibmMqUser: "app",
  incomingMessageBucket: "incoming-messages",
  mqPassword: "admin",
  mqUrl: "failover:(stomp://localhost:61613)",
  mqUser: "admin",
  phase1Bucket: "phase1",
  pncHost: "localhost",
  pncPort: "3000",
  postgresHost: "localhost",
  postgresPassword: "password",
  postgresPort: "5432",
  postgresUser: "bichard",
  uiHost: "localhost",
  uiPort: "4443",
  uiScheme: "https"
}

export default defaults

const defaults = {
  awsRegion: "eu-west-2",
  awsUrl: "http://localhost:4566",
  phase1Bucket: "phase1",
  incomingMessageBucket: "incoming-messages",
  postgresHost: "localhost",
  postgresPort: "5432",
  postgresUser: "bichard",
  postgresPassword: "password",
  mqUrl: "failover:(stomp://localhost:61613)",
  mqUser: "admin",
  mqPassword: "admin",
  db2Host: "localhost",
  db2Port: 50000,
  db2User: "db2inst1",
  db2Password: "TEST_DB2INST1_PASSWORD",
  ibmMqUrl: "localhost:10443",
  ibmMqUser: "app",
  ibmMqPassword: "passw0rd",
  ibmMqQmgr: "BR7_QM",
  pncHost: "localhost",
  pncPort: "3000",
  uiScheme: "https",
  uiPort: "4443",
  uiHost: "localhost",
  enableCorePhase1: "false"
}

export default defaults

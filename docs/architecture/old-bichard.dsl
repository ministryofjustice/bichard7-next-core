workspace "Bichard Old" {
  model {
    !include lib/users.dsl

    !include lib/hmcts.dsl
    !include lib/home-office.dsl

    cjsm = softwareSystem "CJSM" {
      tags "Existing System"
    }

    slack = softwareSystem "Slack" "An instant messaging service used by Made Tech" {
      url "https://slack.com/"
      tags "External"
    }

    pagerDuty = softwareSystem "PagerDuty" "An alert tool for instances when the systems trigger an alarm" {
      url "https://www.pagerduty.com/"
      tags "External"
    }


    group "CJSE" {
      qsolution = softwareSystem "PSN Proxy" "Q-Solution" "Nginx" {
        tags "Existing System"
      }

      exiss = softwareSystem "ExISS" {
        tags "Existing System"
      }

      oldBichard = softwareSystem "Old Bichard" {
        beanconnect = container "Beanconnect"

        messageTransfer = container "Message Transfer Lambda" {
          incomingS3Bucket = component "External Incoming S3 bucket" {
            tags "Queue"
          }

          transferProcess = component "Transfer lambda" {
            tags "Lambda"
          }
        }

        incomingMessageHandler = container "Incoming Message Handler Step Function" {
          internalIncomingS3Bucket = component "Internal Incoming S3 bucket" {
            tags "Queue"
          }

          storeMessage = component "Store Message" {
            tags "Lambda"
          }

          sendToBichard = component "Send to Bichard" {
            tags "Lambda"
          }

          recordSentToBichard = component "Record Sent to Bichard" {
            tags "Lambda"
          }
        }

        eventLambda = container "Event Lambda"

        eventHandler = container "Event Handler Step Function" {
          eventS3Bucket = component "Event S3 bucket" {
            tags "Queue"
          }

          writeToAuditLog = component "Write to Audit Log" {
            tags "Lambda"
          }
        }

        activeMQ = container "Active MQ" "" "Active MQ"

        nginxAuthProxy = container "Nginx Auth Proxy" "" "Nginx" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Nginx_Auth_Proxy"
        }

        database = container "Bichard Database" "" "PostgreSQL" "Database" {
          tags "Existing System"
        }

        emailSystem = container "Email System" "" "Postfix" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Postfix"
        }

        bichardJavaApplication = container "Bichard Java Application" "" "Java EE"{
          tags "Existing System"
        }

        bichardUserService = container "Bichard User Service" "An application to provide user authentication and user management" "Next.js, TypeScript & React" {
          url "https://github.com/ministryofjustice/bichard7-next-user-service"
          tags "API"
        }

        auditLogApi = container "Audit Log" {
          tags "API"

          auditLogApiGateway = component "Audit Log API Gateway"
          auditLogApiLambda = component "Audit Log API Lambda"
          dynamoDB = component "DynamoDB" "" "DynamoDB"
        }

        staticFileService = container "Static File Service"

        reportingService = container "Reporting" {
          automationReport = component "Automation Report" {
            tags "Lambda"
          }
          commonPlatformReport = component "Common Platform Report"{
            tags "Lambda"
          }
          MPSReport = component "MPS Report"{
            tags "Lambda"
          }
          topExceptionsReport = component "Top Exceptions Report"{
            tags "Lambda"
          }
        }

        monitoring = container "Monitoring" {
          openSearch = component "OpenSearch"
          prometheus = component "Prometheus"
          prometheusCloudWatchExporter = component "Prometheus CloudWatch Exporter"
          prometheusBlackBoxExporter = component "Prometheus Black Box Exporter"
          grafana = component "Grafana"
          logStash = component "LogStash"
          cloudWatchLogs = component "CloudWatch Logs" "Logs gathered from all AWS services"
          cloudWatchMetrics = component "CloudWatch Metrics"
          slackLambda = component "Slack message handler" {
            tags "Lambda"
          }
        }
      }
    }

    # Relationships between people and software systems
    policeUser -> qsolution "Uses"
    policeUser -> pnc "Uses"
    cjsm -> policeUser "Gets email"

    # Relationships between software systems
    commonPlatform -> exiss "Sends result of a court case"
    libra -> exiss "Sends result of a court case"
    qsolution -> pnc "Uses"

    bichardJavaApplication -> beanconnect

    beanconnect -> qsolution

    qsolution -> pnc
    qsolution -> nginxAuthProxy

    # Relationships to/from components
    emailSystem -> cjsm "Sends verification code"
    bichardUserService -> emailSystem "Sends verification code"

    nginxAuthProxy -> bichardJavaApplication
    nginxAuthProxy -> bichardUserService "Uses"
    nginxAuthProxy -> staticFileService

    bichardUserService -> database "Reads from / Writes to"
    bichardJavaApplication -> database "Reads from / Writes to"

    exiss -> incomingS3Bucket
    incomingS3Bucket -> transferProcess
    transferProcess -> internalIncomingS3Bucket
    internalIncomingS3Bucket -> storeMessage
    storeMessage -> auditLogApi
    storeMessage -> sendToBichard
    sendToBichard -> activeMQ
    sendToBichard -> recordSentToBichard
    recordSentToBichard -> auditLogApi

    activeMQ -> eventLambda
    eventLambda -> eventS3Bucket
    eventS3Bucket -> writeToAuditLog
    writeToAuditLog -> auditLogApi

    activeMQ -> bichardJavaApplication
    bichardJavaApplication -> activeMQ

    # Audit Logger
    auditLogApiGateway -> auditLogApiLambda
    auditLogApiLambda -> dynamoDB
    auditLogApiLambda -> database
    auditLogApiLambda -> activeMQ

    # Reporting
    automationReport -> auditLogApi
    commonPlatformReport -> auditLogApi
    automationReport -> staticFileService
    topExceptionsReport -> staticFileService
    commonPlatformReport -> emailSystem
    MPSReport -> database
    topExceptionsReport -> auditLogApi

    # Monitoring
    prometheusBlackBoxExporter -> nginxAuthProxy "Healthcheck" "via HTTPS"
    prometheusBlackBoxExporter -> prometheus
    prometheusCloudWatchExporter -> prometheus
    prometheusCloudWatchExporter -> cloudWatchMetrics

    prometheus -> slackLambda "Sends message" "via SNS"
    cloudWatchMetrics -> slackLambda "Sends message" "via SNS"
    prometheus -> grafana
    logStash -> openSearch
    cloudWatchLogs -> logStash

    prometheus -> pagerDuty "Sends message" "via SNS"
    slackLambda -> slack "Sends message" "via TLS Webhook"
  }

  views {
    systemLandscape "SystemLandscape" {
      include *
      autoLayout lr
    }

    systemContext oldBichard {
      include *
      autoLayout lr
    }

    container oldBichard "OldBichard" {
      include *
      autoLayout
    }

    component incomingMessageHandler {
      include *
      autoLayout lr
    }

    component messageTransfer {
      include *
      autoLayout
    }

    component auditLogApi {
      include *
      autoLayout lr
    }

    component eventHandler {
      include *
      autoLayout lr
    }

    component reportingService {
      include *
      autoLayout lr
    }

    component monitoring {
      include *
      autoLayout lr
    }

    theme default

    styles {
      element "Web Browser" {
        shape WebBrowser
      }

      element "Database" {
        shape Cylinder
      }

      element "API" {
        shape hexagon
      }

      element "Queue" {
        shape "Pipe"
      }

      element "Lambda" {
        shape "Diamond"
      }

      element "External" {
        background #9b76ff
        color #ffffff
      }

      element "Existing System" {
        background #999999
        color #ffffff
      }
    }
  }
}

workspace "Bichard" {
  !docs docs
  !adrs adrs

  model {
    !include lib/users.dsl

    !include lib/ministry-of-justice.dsl
    !include lib/home-office.dsl
    !include lib/external.dsl

    group "CJSE (Criminal Justice System Exchange)" {
      qsolution = softwareSystem "PSN Proxy" "Q-Solution" "Nginx" {
        tags "Ministry of Justice" "CJSE" "Existing System"
      }

      exiss = softwareSystem "ExISS" "Exchange Integrated Shared Services" {
        tags "Ministry of Justice" "CJSE" "Existing System"
      }

      bichard = softwareSystem "Bichard" {
        tags "Ministry of Justice" "CJSE"

        dynamoDB =  container "DynamoDB" {
          tags "Database"
        }

        beanconnect = container "Beanconnect" "Acts as a bridge between Java EE applications (Enterprise JavaBeans or servlets) and SAP backend systems" {
          tags "Existing System" "ECS"
        }

        messageTransfer = container "Message Transfer Lambda" "" "Typescript" {
          tags "Lambda"

          incomingS3Bucket = component "External Incoming S3 bucket" {
            tags "S3" "Queue"
          }

          transferProcess = component "Transfer lambda" {
            tags "Lambda"
          }

          internalIncomingS3Bucket = component "Internal Incoming S3 bucket" {
            tags "S3" "Queue"
          }

          sqs = component "SQS queue" {
            tags "Queue"
          }
        }

        eventHandler = container "Event Handler Step Function" {
          tags "Step Function"

          eventHandlerMqPoller = component "MQ Poller" "Typescript" {
            tags "Lambda" "Event Source Mapping"
          }

          eventHandlerS3Bucket = component "Event S3 bucket" {
            tags "S3" "Queue"
          }

          eventHandlerWriteToAuditLog = component "Write to Audit Log" "" "Typescript" {
            tags "Lambda"
          }
        }

        activeMQ = container "Active MQ" "" "Active MQ" {
          tags "Existing System" "Queue"
        }

        nginxAuthProxy = container "Nginx Auth Proxy" "" "Nginx" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Nginx_Auth_Proxy"
          tags "ECS" "Proxy"
        }

        database = container "Bichard Database" "" "PostgreSQL" "Database" {
          tags "Existing System" "Database"
        }

        emailSystem = container "Email System" "" "Postfix" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Postfix"
          tags "ECS"
        }

        auditLogApi = container "Audit Log API" "" "Typescript" {
          tags "API"

          auditLogApiGateway = component "Audit Log API Gateway" "" "API Gateway"
          auditLogApiLambdas = component "Audit Log API Lambdas" "" "Typescript"
        }

        messageForwarder = container "Message Forwarder" "Polls and forwards MQ messages to old Bichard queues or conductor" "Typescript" {
          tags "Lambda" "Event Source Mapping"
        }

        bichardJavaApplication = container "Bichard Java Application" "" "Java EE"{
          tags "ECS" "Web Browser" "Existing System"
        }

        pncApi = container "PNC API" "" "Java EE" {
          tags "ECS" "API" "Existing System"
        }

        bichardUserService = container "Bichard User Service" "An application to provide user authentication and user management" "Next.js, TypeScript & React" {
          url "https://github.com/ministryofjustice/bichard7-next-user-service"
          tags "ECS" "Web Browser"
        }

        staticFileService = container "Static File Service" {
          s3WebProxy = component "S3 Web Proxy" "Web server for serving files stored in an S3 bucket" {
            tags "ECS" "Web Browser"
          }

          staticFilesS3Bucket = component "Static Files S3 Bucket" {
            tags "S3"
          }
        }

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
          cloudWatchLogs = component "CloudWatch Logs" "Logs gathered from all AWS services"
          cloudWatchMetrics = component "CloudWatch Metrics"
          slackLambda = component "Slack message handler" {
            tags "Lambda"
          }
          sns = component "SNS" {
            tags "SNS" "Queue"
          }
        }

        ####### Hybrid
        bichardUI = container "Bichard UI" "A new way of interacting with Bichard, complying with Gov.uk standards" "TypeScript & React" "Web Browser" {
          url "https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/ui"
          tags "ECS" "Web Browser"
        }

        conductor = container "Conductor" {
          url "https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/conductor"

          group "Core Worker" {
            incomingMessageHandler = component "Incoming Message Handler" "" "Typescript" {
              tags "Workflow"
            }
            phaseOne = component "Phase 1" "" "TypeScript" {
              tags "Workflow"
            }
            phaseTwo = component "Phase 2" "" "TypeScript" {
              tags "Workflow"
            }
            phaseThree = component "Phase 3" "" "TypeScript" {
              tags "Workflow"
            }
          }
        }

        bichardAPI = container "Bichard API" "An API to remove DB actions from UI and to be Audit Logs" "TypeScript, Fastify & Zod" "API" {
          url "https://github.com/ministryofjustice/bichard7-next-core/tree/main/packages/api"
          tags "ECS" "API"
        }

        ledsProxy = container "LEDS Proxy" {
          tags "VPC" "Proxy"

          ledsProxyLambda = component "Proxy Lambda" {
            tags "Lambda"
          }

          ledsTgw = component "LEDS Transit Gateway" "Access to LEDS environment is via a Transit Gateway managed by the LEDS team" {
            tags "Transit Gateway" "TGW"
          }
        }
      }
    }

    # Relationships between people and software systems
    policeUser -> pnc "Uses"
    policeUser -> leds "Uses"
    policeUser -> nginxAuthProxy "Uses"
    cjsm -> policeUser "Gets email"

    # Relationships between software systems
    commonPlatform -> exiss "Sends result of a court case"
    libra -> exiss "Sends result of a court case"
    qsolution -> pnc "Uses"

    bichardJavaApplication -> pncApi

    beanconnect -> qsolution

    # Relationships to/from components
    emailSystem -> cjsm "via Internet" "Sends verification code / Notifies the Common Platform about invalid incoming messages"
    bichardUserService -> emailSystem "Sends verification code"

    nginxAuthProxy -> bichardJavaApplication
    nginxAuthProxy -> bichardUserService "Uses"
    nginxAuthProxy -> s3WebProxy "" "Fetches reports and help pages"

    bichardUserService -> database "Reads from / Writes to"
    bichardJavaApplication -> database "Reads from / Writes to"
    bichardAPI -> database "Reads from / Writes to"

    exiss -> incomingS3Bucket
    incomingS3Bucket -> transferProcess
    transferProcess -> internalIncomingS3Bucket
    internalIncomingS3Bucket -> sqs

    activeMQ -> bichardJavaApplication
    bichardJavaApplication -> activeMQ

    # Event handler
    activeMQ -> eventHandlerMqPoller
    eventHandlerMqPoller -> eventHandlerS3Bucket
    eventHandlerS3Bucket -> eventHandlerWriteToAuditLog
    eventHandlerWriteToAuditLog -> auditLogApiGateway

    # Aduit log API
    auditLogApiGateway -> auditLogApiLambdas
    auditLogApiLambdas -> dynamoDB
    auditLogApiLambdas -> database

    # Message forwarder
    activeMQ -> messageForwarder
    messageForwarder -> activeMQ
    messageForwarder -> conductor

    # Bichard API
    bichardAPI -> dynamoDB
    bichardAPI -> ledsProxyLambda "Encrypted via HTTPS"
    bichardAPI -> niam "via Internet" "Gets auth token to access LEDS API"

    # Reporting
    automationReport -> bichardAPI
    MPSReport -> database
    topExceptionsReport -> bichardAPI
    automationReport -> staticFilesS3Bucket "" "Stores generated reports in the S3 bucket"
    topExceptionsReport -> staticFilesS3Bucket  "" "Stores generated reports in the S3 bucket"

    # Monitoring
    cloudWatchMetrics -> sns

    sns -> pagerDuty "Sends message"
    sns -> slackLambda "Sends message"
    slackLambda -> slack "Sends message" "via TLS Webhook"

    ####### Hybrid
    nginxAuthProxy -> bichardUI
    bichardUI -> database
    bichardUI -> bichardAPI

    pncApi -> beanconnect

    conductor -> database
    messageTransfer -> conductor

    # Inside conductor
    sqs -> incomingMessageHandler
    incomingMessageHandler -> phaseOne
    phaseOne -> phaseTwo
    phaseTwo -> phaseThree

    incomingMessageHandler -> bichardAPI
    phaseOne -> bichardAPI
    phaseTwo -> bichardAPI
    phaseThree -> bichardAPI

    bichardAPI -> phaseOne "Resubmits to Phase 1"
    bichardAPI -> phaseTwo "Resubmits to Phase 2"

    phaseOne -> pncApi "Queries PNC by ASN"
    phaseThree -> pncApi "Updates PNC"

    phaseOne -> database
    phaseTwo -> database
    phaseThree -> database

    incomingMessageHandler -> emailSystem "Alert Common Platform" "When incoming message format is invalid, Common Platform is notified via email"

    # LEDS proxy
    ledsProxyLambda -> ledsTgw "" "Encrypted via mTLS"
    ledsTgw -> leds "" "Encrypted via mTLS"

    # Static file service
    s3WebProxy -> staticFilesS3Bucket
  }

  views {
    systemLandscape "SystemLandscape" {
      include * pnc
      exclude slack pagerDuty
      autoLayout lr
    }

    systemContext bichard "BichardSystemContext" {
      include * pnc
      exclude slack pagerDuty
      autoLayout lr
    }

    container bichard "OldBichard" {
      include * pnc
      exclude slack pagerDuty bichardUI conductor bichardAPI ledsProxy
      autoLayout
      title "Old Bichard"
    }

    container bichard "HybridBichard" {
      include * pnc
      exclude slack pagerDuty
      autoLayout
      title "Hybrid Bichard"
    }

    component conductor {
      include *
      autoLayout lr
    }

    component messageTransfer {
      include *
      autoLayout
    }

    component eventHandler {
      include *
      autoLayout lr
    }

    component reportingService {
      include *
      autoLayout lr
    }

    component staticFileService {
      include *
      autoLayout lr
    }

    component ledsProxy {
      include * niam
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

      element "SNS" {
        shape Pipe
      }

      element "External" {
        background #9b76ff
        color #ffffff
      }

      element "Existing System" {
        background #999999
        color #ffffff
      }

      element "Ministry of Justice" {
        background #999777
        color #ffffff
      }

      element "Home Office" {
        background #879977
        color #ffffff
      }
    }
  }
}

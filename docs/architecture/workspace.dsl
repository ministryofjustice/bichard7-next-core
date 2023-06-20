workspace "Bichard Next" {
  !docs docs
  !adrs adrs

  model {
    policeUser = person "Police User"

    group "HMCTS" {
      commmonPlatform = softwareSystem "Common Platform" {
        tags "Existing System"
      }
      libra = softwareSystem "Libra" {
        tags "Existing System"
      }
    }

    group "Ministry of Justice" {

      qsolution = softwareSystem "PNC Proxy" "Q-Solution" "Nginx" {
        tags "Existing System"
      }

      exiss = softwareSystem "ExISS" {
        tags "Existing System"
      }

      bichard = softwareSystem "Bichard" "A system to help other systems interact" "TypeScript" {
        url "https://github.com/ministryofjustice/bichard7-next-core"

        amazonS3 = container "Amazon S3 - Incoming Bucket" "" "Amazon S3"
        amazonS3Transfered = container "Amazon S3 - Transfered Bucket" "" "Amazon S3"
        incomingMessageHandler = container "Incoming Message Handler Step Function"
        amazonMQ = container "Amazon MQ" "" "Amazon MQ"
        auditLogApi = container "Audit Log API"
        dynamo = container "Dynamo" "" "DynamoDB" "Database"
        beanconnect = container "Beanconnect" {
          tags "Existing System"
        }

        nginxAuthProxy = container "Nginx Auth Proxy" "" "Nginx" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Nginx_Auth_Proxy"
        }

        bichardUI = container "Bichard UI" "A new way of interacting with Bichard, complying with Gov.uk standards" "TypeScript & React" "Web Browser" {
          url "https://github.com/ministryofjustice/bichard7-next-ui"
        }

        bichardUserService = container "Bichard User Service" "An application to provide user authentication and user management" "Next.js, TypeScript & React" {
          url "https://github.com/ministryofjustice/bichard7-next-user-service"
          tags "API"
        }

        emailSystem = container "Email System" {
          postfix = component "Email System" "" "Postfix" {
            url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Postfix"
          }
        }

        database = container "Database" "" "PostgreSQL" "Database" {
          tags "Existing System"
        }

        group "Conductor" {
          conductor = container "Bichard Next Core" {
            bichardNextCore = component "Bichard Next Core" "The code to replace the processing logic of Bichard7" "Next.js, TypeScript" {
              url "https://github.com/ministryofjustice/bichard7-next-core"
              tags "API"
            }
          }
        }

        bichardJavaApplication = container "Bichard Java Application" "" "Java EE"{
          tags "Existing System"
        }

        amazonLambda = container "Amazon Lambda" "" "Amazon Lambda"

        pncApi = container "PNC API" {
          tags "API"
        }
      }

      cjsm = softwareSystem "CJSM" {
        tags "Existing System"
      }
    }

    group "Home Office - Police" {
      pnc = softwareSystem "Police National Computer"
    }

    # Relationships between people and software systems
    policeUser -> nginxAuthProxy "Uses"
    policeUser -> qsolution "Uses"
    policeUser -> pnc "Uses"
    cjsm -> policeUser "Gets email"

    # Relationships between software systems
    commmonPlatform -> exiss "Sends result of a court case"
    libra -> exiss "Sends result of a court case"
    qsolution -> pnc

    # Relationships to/from container

    ## Court handler
    exiss -> amazonS3 "Sends results of court cases"
    amazonS3 -> amazonS3Transfered "Transfers"
    amazonS3Transfered -> incomingMessageHandler

    ## Logging
    auditLogApi -> dynamo
    bichardUI -> auditLogApi
    incomingMessageHandler -> auditLogApi
    bichardNextCore -> auditLogApi

    ## Auth
    nginxAuthProxy -> bichardUI "Uses"
    nginxAuthProxy -> bichardUserService "Uses"
    bichardUserService -> postfix "Sends verification code"
    nginxAuthProxy -> bichardJavaApplication

    ## Database actions
    bichardUI -> database "Reads from and writes to"
    bichardUserService -> database "Reads from and writes to"
    bichardNextCore -> database "Reads from and writes to"
    bichardJavaApplication -> database

    # Queues
    incomingMessageHandler -> amazonMQ
    bichardJavaApplication -> amazonMQ
    amazonMQ -> bichardJavaApplication

    ## PNC Connection
    bichardNextCore -> pncApi
    pncApi -> beanconnect
    beanconnect -> qsolution
    bichardJavaApplication -> beanconnect
    bichardJavaApplication -> qsolution

    ## Phase 1
    amazonMQ -> amazonLambda
    amazonLambda -> amazonS3Transfered

    # Relationships to/from components
    postfix -> cjsm "Relays email"
  }

  views {
    systemlandscape "SystemLandscape" {
      include *
      autoLayout
    }

    systemContext bichard {
      include *
      autolayout lr
    }

    container bichard {
      include *
      autolayout
    }

    component emailSystem {
      include *
      autolayout lr
    }

    component conductor {
      include *
      autolayout lr
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

      element "Existing System" {
        background #999999
        color #ffffff
      }
    }
  }
}


workspace "Bichard Next" {
  !docs docs
  !adrs adrs

  model {

    policeUser = person "Police User"

    qsolution = softwareSystem "PNC Proxy" "Q-Solution" "Nginx"

    group "Ministry of Justice" {

      courts = softwareSystem "Courts" {
        commmonPlatform = container "Common Platform"
        libra = container "Libra"
      }

      exiss = softwareSystem "ExISS" {
        commmonPlatform -> this "Sends result of a court case"
        libra -> this "Sends result of a court case"
      }

      bichard = softwareSystem "Bichard" "A system to help other systems interact" "TypeScript" {
        url "https://github.com/ministryofjustice/bichard7-next-core"

        amazonS3 = container "Amazon S3" "" "Amazon S3"
        exiss -> amazonS3

        incomingMessageHandler = container "Incoming Message Handler Step Function"
        amazonMQ = container "Amazon MQ" "" "Amazon MQ"

        amazonS3 -> incomingMessageHandler

        auditLogApi = container "Audit Log API"
        dynamo = container "Dynamo" "" "DynamoDB"
        auditLogApi -> dynamo

        incomingMessageHandler -> amazonMQ
        incomingMessageHandler -> auditLogApi

        beanconnect = container "Beanconnect"

        nginxAuthProxy = container "Nginx Auth Proxy" "" "Nginx" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Nginx_Auth_Proxy"

          policeUser -> this "Uses"
        }

        bichardUI = container "Bichard UI" "A new way of interacting with Bichard, complying with Gov.uk standards" "TypeScript & React" {
          url "https://github.com/ministryofjustice/bichard7-next-ui"

          nginxAuthProxy -> this "Uses"
          this -> auditLogApi
        }

        bichardUserService = container "Bichard User Service" "An application to provide user authentication and user management" "Next.js, TypeScript & React" {
          url "https://github.com/ministryofjustice/bichard7-next-user-service"

          nginxAuthProxy -> this "Uses"
        }

        postfix = container "Email Sender" "" "Postfix" {
          url "https://github.com/ministryofjustice/bichard7-next-infrastructure-docker-images/tree/main/Postfix"

          bichardUserService -> this "Sends verification code"
        }

        database = container "Database" "" "PostgreSQL" {
          bichardUI -> this "Reads from and writes to"
          bichardUserService -> this "Reads from and writes to"
        }

        group "Conductor" {
          bichardNextCore = container "Bichard Next Core" "The code to replace the processing logic of Bichard7" "Next.js, TypeScript" {
            url "https://github.com/ministryofjustice/bichard7-next-core"

            database -> this "Reads from and writes to"
          }
        }

        bichardJavaApplication = container "Bichard Java Application" "" "Java EE" {
          amazonMQ -> this
          this -> beanconnect
          nginxAuthProxy -> this
          this -> qsolution
          this -> database
        }

        bichardJavaApplication -> amazonMQ

        stepFunction = container "Step function"

        amazonLambda = container "Amazon Lambda" "" "Amazon Lambda" {
          amazonMQ -> this
          this -> amazonS3
          amazonS3 -> stepFunction
          stepFunction -> auditLogApi
        }


        pncApi = container "PNC API" {
          this -> beanconnect
          bichardNextCore -> this
        }
      }

      cjsm = softwareSystem "CJSM" {
        postfix -> this "Relays email"

        this -> policeUser
        beanconnect -> qsolution
      }
    }

    group "Home Office - Police" {

      pnc = softwareSystem "Police National Computer" {
        policeUser -> this "Uses"
      }

      qsolution -> pnc
    }
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
      autolayout lr
    }

    systemContext courts {
      include *
      autolayout lr
    }

    container courts {
      include *
      autolayout lr
    }

    theme default
  }

}

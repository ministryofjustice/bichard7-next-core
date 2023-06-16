
workspace "Bichard Next" {
  !docs docs
  !adrs adrs

  model {
    user = person "User"
    bichard = softwareSystem "Bichard" "A system to help other systems interact" "TypeScript" {
      url "https://github.com/ministryofjustice/bichard7-next-core"

      bichardUI = container "Bichard UI" "A new way of interacting with Bichard, complying with Gov.uk standards" "TypeScript & React" {
        url "https://github.com/ministryofjustice/bichard7-next-ui"

        user -> this "Uses"
      }

      container "Database" "" "PostgreSQL" {
        bichardUI -> this "Reads from and writes to"
      }
    }

  }

  views {
    systemContext bichard {
      include *
      autolayout lr
    }

    container bichard {
      include *
      autolayout lr
    }

    theme default
  }

}

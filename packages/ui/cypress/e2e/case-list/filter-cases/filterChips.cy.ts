import {
  confirmFiltersAppliedContains,
  filterByCaseAge,
  filterByDateRange,
  loginAndVisit,
  removeFilterChip
} from "../../../support/helpers"

describe("Case list", () => {
  context("When filters applied", () => {
    beforeEach(() => {
      loginAndVisit()
    })

    it("Should display no filters chips and a placeholder message as the default state", () => {
      cy.get(".moj-filter__tag").should("not.exist")
      cy.get(".govuk-checkboxes__item").should("not.be.checked")
      cy.get(".govuk-radios__input[name='reason']").should("be.checked")
      cy.get(".govuk-radios__input[name='lockedState']").should("be.checked")
      cy.get(".govuk-radios__input[name='courtDate']").should("not.be.checked")

      cy.get(".moj-filter__selected").should("exist").should("contain.text", "No filters selected")
    })

    describe("Reason", () => {
      it("Should display the Triggers filter chip when selected", () => {
        cy.get(".govuk-radios__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")
      })

      it("Should remove the Triggers filter chip when the chip is clicked and select All in the filter panel", () => {
        cy.get(".govuk-radios__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")

        removeFilterChip()

        cy.get("input#triggers-reason").should("not.be.checked")
        cy.get("input#all-reason").should("be.checked")
      })

      it("Should display the Exceptions filter chip when selected", () => {
        cy.get(".govuk-radios__item").contains("Exceptions").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("not.exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("exist")
      })

      it("Should remove the Exceptions filter chip when the chip is clicked and select All in the filter panel", () => {
        cy.get(".govuk-radios__item").contains("Exceptions").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("not.exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("exist")

        removeFilterChip()

        cy.get("input#exceptions-reason").should("not.be.checked")
        cy.get("input#all-reason").should("be.checked")
      })
    })

    describe("Case age (SLA)", () => {
      it("Should allow you to add 'today' as the case age filter chip", () => {
        // Shows filters and clicks case age followed by today's date
        filterByCaseAge(`label[for="case-age-today"]`)

        // Shows the correct heading 'Today' and checks that the others are not visible
        cy.get(".govuk-heading-s").contains("Case age (SLA)").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("exist")
        cy.get(".moj-filter__tag").contains("Yesterday").should("not.exist")
        cy.get(".moj-filter__tag").contains("2 days ago").should("not.exist")
        cy.get(".moj-filter__tag").contains("3 days ago").should("not.exist")
      })

      it("Should remove the case age filter chip when date range is selected", () => {
        filterByCaseAge(`label[for="case-age-today"]`)

        filterByDateRange("2022-01-01", "2022-12-31")

        cy.get(".govuk-heading-s").contains("Case age (SLA)").should("not.exist")
        cy.get(".moj-filter__tag").contains("Today").should("not.exist")
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("exist")
      })
    })

    describe("Date range", () => {
      it("Should allow you to add date range filter chip", () => {
        filterByDateRange("2022-01-01", "2022-12-31")
        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")
        cy.get("button#search").click()

        cy.get(".govuk-heading-m").contains("Applied filters").should("exist")
        confirmFiltersAppliedContains("01/01/2022 - 31/12/2022")
      })

      it("Should remove date range filter chip when case age filter is selected", () => {
        filterByDateRange("2022-01-01", "2022-12-31")
        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022")

        filterByCaseAge(`label[for="case-age-today"]`)

        cy.get(".govuk-heading-s").contains("Date range").should("not.exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("not.exist")
        cy.get(".govuk-heading-s").contains("Case age (SLA)").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("exist")

        cy.get(`label[for="date-range"]`).click()
        cy.get(`label[for="date-from"]`).invoke("val").should("be.empty")
        cy.get(`label[for="date-to"]`).invoke("val").should("be.empty")
      })

      it("Should apply the 'Date filter' filter chips then remove this chips to the original state", () => {
        cy.get(`label[for="date-range"]`).click()
        cy.get(`label[for="date-from"]`).should("have.value", "")
        cy.get(`label[for="date-to"]`).should("have.value", "")
        cy.get(`label[for="date-from"]`).type("2022-01-01")
        cy.get(`label[for="date-to"]`).type("2022-12-31")

        cy.get(".govuk-heading-m").contains("Selected filters").should("exist")
        cy.get(".govuk-heading-s").contains("Date range").should("exist")
        cy.get(".moj-filter__tag").contains("01/01/2022 - 31/12/2022").should("exist").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
        cy.get(`label[for="date-from"]`).should("have.value", "")
        cy.get(`label[for="date-to"]`).should("have.value", "")
      })

      it("Should populate `date to` when `same date` button is clicked", () => {
        cy.get(`label[for="date-range"]`).click()
        cy.contains("Same date").should("not.exist")
        cy.get(`label[for="date-from"]`).click()
        cy.get(`label[for="date-from"]`).type("2023-03-17")
        cy.get(`label[for="date-to"]`).should("have.value", "")

        cy.contains("Same date").should("exist")
        cy.get("#apply-same-date-button").click()

        cy.get("#date-from").should("have.value", "2023-03-17")
      })
    })

    describe("Case state", () => {
      it("Should apply the 'Resolved cases' filter chip when resolved cases checkbox seltected and cancels it when the 'X' is clicked", () => {
        cy.get(`label[for="resolved"]`).click()

        cy.get(".govuk-heading-s").contains("Case state").should("exist")
        cy.get(".moj-filter__tag").contains("Resolved cases").should("exist")

        // Removes the resolved cases filter chips
        cy.get("li button.moj-filter__tag").contains("Resolved cases").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
        cy.get(".govuk-checkboxes__item").contains("Resolved").should("not.be.checked")
      })
    })

    describe("Locked status", () => {
      it("Should apply the 'Locked cases only' filter chips then remove this chips to the original state", () => {
        cy.get(`label[for="locked-state-locked"]`).click()

        cy.get(".govuk-heading-s").contains("Locked state").should("exist")
        cy.get(".moj-filter__tag").contains("Locked").should("exist")
        cy.get(".moj-filter__tag").contains("Unlocked").should("not.exist")

        cy.get("li button.moj-filter__tag").contains("Locked").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Defendant name", () => {
      it("Should apply the 'Defendant name' filter chips then remove this chips to the original state", () => {
        cy.get("input[id=defendantName]").type("Foo")

        cy.get(".govuk-heading-s").contains("Defendant name").should("exist")
        cy.get(".moj-filter__tag").contains("Foo").should("exist")

        cy.get("li button.moj-filter__tag").contains("Foo").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Court name", () => {
      it("Should apply the 'Court name' filter chips then remove this chips to the original state", () => {
        cy.get("input[id=courtName]").type("Bar")

        cy.get(".govuk-heading-s").contains("Court name").should("exist")
        cy.get(".moj-filter__tag").contains("Bar").should("exist")

        cy.get("li button.moj-filter__tag").contains("Bar").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Reason code", () => {
      it("Should apply the 'Reason Code' filter chips then remove this chips to the original state", () => {
        cy.get("input[id=reasonCodes]").type("Bar")

        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("BAR").should("exist")

        cy.get("li button.moj-filter__tag").contains("BAR").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })

      it("Should be able to remove individual reason code filter chips", () => {
        cy.get("input[id=reasonCodes]").type("Foo Bar")

        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("BAR").should("exist")

        cy.get("li button.moj-filter__tag").contains("BAR").trigger("click")
        cy.get(".moj-filter__tag").contains("BAR").should("not.exist")
      })
    })

    describe("PTIURN", () => {
      it("Should apply the 'PTIURN' filter chips then remove this chips to the original state", () => {
        cy.get("input[id=ptiurn]").type("Bar")

        cy.get(".govuk-heading-s").contains("PTIURN").should("exist")
        cy.get(".moj-filter__tag").contains("Bar").should("exist")

        cy.get("li button.moj-filter__tag").contains("Bar").trigger("click")
        cy.get(".moj-filter__tag").should("not.exist")
      })
    })

    describe("Selecting multiple filters", () => {
      it("Should display a filter chip for each search filter", () => {
        // Open filters and build filter chip query
        cy.get(".govuk-radios__item").contains("Triggers").click()

        filterByCaseAge(`label[for="case-age-2-days-ago"]`)
        cy.get(`label[for="locked-state-lockedtome"]`).click()

        // Check that relevant chips and headers are present on screen
        // Reason
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")
        // Cases locked to me
        cy.get(".govuk-heading-s").contains("Locked state").should("exist")
        cy.get(".moj-filter__tag").contains("Locked to me").should("exist")
        // Case Age (SLA)
        cy.get(".govuk-heading-s").contains("Case age (SLA)").should("exist")
        cy.get(".moj-filter__tag").contains("2 days ago").should("exist")
        cy.get(".moj-filter__tag").contains("Today").should("not.exist")
        cy.get(".moj-filter__tag").contains("Yesterday").should("not.exist")
        cy.get(".moj-filter__tag").contains("3 days ago").should("not.exist")

        // submit query and display filter chips in filters applied section
        cy.get("#search").contains("Apply filters").click()
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Locked to me").should("exist")
        cy.get(".moj-filter__tag").contains("2 days ago").should("exist")
      })
    })

    describe('Applied filter chips to "Filter applied" section', () => {
      it("Should display the Trigger filter chip when selected", () => {
        cy.get(".govuk-radios__item").contains("Triggers").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Reason").should("exist")
        cy.get(".moj-filter__tag").contains("Triggers").should("exist")
        cy.get(".moj-filter__tag").contains("Exceptions").should("not.exist")

        // Check if the filter chip is applied to the "Filters applied" section at the top of the case list
        cy.contains("Apply filters").click()
        cy.get(".moj-filter-tags").contains("Triggers").should("exist")

        // Clears filter chip and check the checkbox is deselected
        cy.get('a[href*="/bichard?keywords="]').contains("Clear filters").click()
        cy.get(".govuk-radios__item").contains("Triggers").should("not.be.checked")
      })

      it("Should display the 'Locked to me' filter chip when selected", () => {
        cy.get(".govuk-radios__item").contains("Cases locked to me").click()

        // Check if the correct heading and filter label are applied
        cy.get(".govuk-heading-s").contains("Locked state").should("exist")
        cy.get(".moj-filter__tag").contains("Locked to me").should("exist")

        // Check if the filter chip is applied to the "Filters applied" section at the top of the case list
        cy.contains("Apply filters").click()
        cy.get(".moj-filter-tags").children().contains("Locked to me").should("exist")
        cy.get("#locked-state-lockedtome").should("be.checked")

        // Clears filter chip using `Clear filters` button and check the checkbox is deselected
        cy.contains("Hide search panel").click()
        cy.get(".moj-filter-tags").contains("Clear filters").click()
        cy.get("#locked-state-lockedtome").should("not.be.checked")
      })

      it("Should select the 'Locked to me' filter chip then remove this chip to the original state", () => {
        cy.get(".govuk-radios__item").contains("Cases locked to me").click()

        // Removal by clicking filter chip
        cy.get(".govuk-heading-s").contains("Locked state").should("exist")
        cy.get(".moj-filter__tag").contains("Locked to me").should("exist").trigger("click")

        cy.get(".govuk-radios__item").contains("Cases locked to me").should("not.be.checked")
      })

      it("Should remove applied `Locked to me` filter by clicking the filter chips ", () => {
        //removal through filter panel
        cy.get(".govuk-radios__item").contains("Cases locked to me").click()
        cy.contains("Apply filters").click()
        cy.get(".moj-filter__tag").contains("Locked to me").should("exist").trigger("click")
        cy.contains("Apply filters").click()

        cy.contains("Locked to me").should("not.exist")
      })
    })
  })
})

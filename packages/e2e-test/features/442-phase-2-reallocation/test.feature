Feature: {441} Phase 2 resubmission

      """
      This tests that an exception raised in Phase 2 or 3 can be resubmitted.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must @NextUI
  Scenario: PNC is updated when there are multiple identical results
    Given I am logged in as "met.police"
      And I view the list of exceptions
    Then I see record for "PUFIVE UPDATE"
      And I see exception "HO100402" in the exception list table
    When I open this record
      And I reallocate the case to "BTP"
    Then I do not see record for "PUFIVE UPDATE"
    When I am logged in as "br7.btp"
      And I view the list of exceptions
    Then I see record for "PUFIVE UPDATE"
      And I see exception "HO100402" in the exception list table

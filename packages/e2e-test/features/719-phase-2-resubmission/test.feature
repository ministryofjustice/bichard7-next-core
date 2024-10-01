Feature: {719} Phase 2 resubmission

      """
      This tests that an exception raised in Phase 2 or 3 can be resubmitted.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  Scenario: PNC is updated when there are multiple identical results
    Given I am logged in as "supervisor"
      And I view the list of exceptions
    Then I see exception "HO100402" in the exception list table
    When I open this record
      And I submit the unchanged record
    Then the PNC updates the record

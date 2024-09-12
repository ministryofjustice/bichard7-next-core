Feature: {718} HO100332 - One court offence three PNC CCRs
      """
      Testing that we can resolve HO100332 exceptions and resubmit to successfully update the PNC

      In this test we are matching one court offence to three PNC CCRs.
      We are limited (maximum) to three CCRs due to PNC limitations.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @NextUI
  Scenario: Resolving one HO100332 exception
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    Then I see exception "HO100332" in the exception list table
    When I open the record for "AVALON MARTIN"
      And I click the "Offences" tab
      And I view offence "1"
      And I match the offence to PNC offence "1" in case "12/2732/000017U"
      And I submit the record
    Then the PNC updates the record

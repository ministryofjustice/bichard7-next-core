Feature: {714} HO100310 - normal case with one offence added in court

      """
      Testing that we can resolve HO100310 exceptions and resubmit to successfully update the PNC

      In this case we have two offences from the court that raise HO100310 exceptions and need manually
      matching to two PNC offences as well as a third offence that has a HO100310 exception but was added in court
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @NextUI
  Scenario: Resolving one pair of HO100310 exceptions with an offence added in court
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    Then I see exception "HO100310 (3)" in the exception list table
    When I open the record for "Bass Barry"
      And I click the "Offences" tab
      And I view offence "1"
      And I match the offence to PNC offence "1"
      And I return to the offence list
      And I view offence "2"
      And I match the offence to PNC offence "2"
      And I return to the offence list
      And I view offence "3"
      And I match the offence as Added In Court
      And I submit the record
    Then the PNC updates the record

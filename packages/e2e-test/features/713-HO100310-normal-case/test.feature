Feature: {713} HO100310 - normal case

      """
      Testing that we can resolve HO100310 exceptions and resubmit to successfully update the PNC

      In this case we have two offences from the court that raise HO100310 exceptions and need manually matching to two PNC offences.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @NextUI
  Scenario: Resolving one pair of HO100310 exceptions
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    Then I see exception "HO100310 (2)" in the exception list table
    When I open the record for "Bass Barry"
      And I click the "Offences" tab
      And I view offence "1"
      And I match the offence to PNC offence "1"
      And I return to the offence list
      And I view offence "2"
      And I match the offence to PNC offence "2"
      And I submit the record
    Then the PNC updates the record

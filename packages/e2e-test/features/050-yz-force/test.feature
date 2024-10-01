Feature: {050} R3.4_BR7_YZ Force Code

      """
      {050} R3.4_BR7_YZ Force Code
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result), portal resubmission and verification of the 'YZ' Force Code for updates sent from the Bichard7 solution directly to the PNC.
      Court Hearing results are sent through the CJSE and onto Bichard7 containing Judgement and Final Result information.
      Exception is created, displayed and resolved on the Portal via data update and record resubmission.
      PNC Exception Update is generated and the Court Hearing Results with portal-added values (Offence Sequence Numbers) are successfully added onto the PNC.
      PRE and POST Triggers are also successfully created on the Portal.
      Verification is also made of the Bichard7 system logs to ensure that the 'YZ' Force Code is used in the update to the PNC to provide an audit trail of those updates made to PNC by the Bichard7 solution.

      MadeTech Definition:
      YZ Force code is used in logs for Bichard (more detail required)
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must @NextUI
  Scenario: YZ Force code is used in logs
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
      And I return to the offence list
      And I submit the record
    Then the PNC updates the record
    When I reload until I see "PS02 - Check address"
      And I open the record for "Bass Barry"
      And I click the "Triggers" tab
    Then I see trigger "TRPR0021" for offence "1"
      And I see trigger "TRPR0006"
      And I see trigger "TRPS0002"
      And the PNC update includes "K01YZ"

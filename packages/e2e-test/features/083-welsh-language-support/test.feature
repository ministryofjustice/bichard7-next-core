Feature: {083} R4.1_BR7_Welsh Language Handling

      """
      {083} R4.1_BR7_Welsh Language Handling
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying the handling of Court Results containing Welsh Language characters, Exception generation, Exception resubmission via the Portal and automation of Results to the PNC.
      Court Hearing results are sent through the CJSE and onto Bichard7 containing Welsh Language characters.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
      Exception is created, displayed and resolved on the Portal via data update and record resubmission.
      Verification is also made that the Welsh Language characters are displayed 'as-is' via the Portal.
      PNC Exception Update is generated and the Court Hearing Results with portal-revised values (ASN & prepending the Offence Result Text with '**') are successfully added onto the PNC.
      Verification is made (by checking the PNC) that the Welsh Language characters have been correctly converted in the PNC Update.
      Pre and Post Update Triggers are also generated.

      MadeTech Definition:
      Welsh language characters are not supported by the PNC
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Should
  Scenario: Using characters from the Welsh Language raises an exception
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    When I open the record for "language welsh"
      And I click the "Defendant" tab
      And I correct "ASN" to "1101ZD010000410836V"
      And I click the "Offences" tab
      And I view offence "1"
      And I prepend "Text" with "**"
      And I click the "Offences" tab
      And I view offence "4"
      And I prepend "Text" with "**"
      And I submit the record
    Then the PNC updates the record
    When I reload until I see "PS10 - Offence added to PNC"
      And I open the record for "language welsh"
      And I click the "Triggers" tab
    Then I see trigger "TRPS0003" for offence "1"
      And I see trigger "TRPS0003" for offence "4"
      And I see trigger "TRPS0010" for offence "4"
      And I see trigger "TRPS0010" for offence "5"

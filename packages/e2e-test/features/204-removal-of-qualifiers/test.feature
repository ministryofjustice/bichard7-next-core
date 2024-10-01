Feature: {204} UAT_Removal of Qualifiers 4004

      """
      {204} UAT_Removal of Qualifiers 4004
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying "CJSResultCode" - "PNCDisposalType" mapping where a Defendant is found Guilty, Bailed and is Awaiting Sentence.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      The solution recognises that the Result Code received from Court ("4530") needs to be mapped to a specific PNC Disposal value in order to be accepted as part of the update to the PNC and given that the Result Class in this case is "Adjournment With Adjudication" the PNC Disposal Type is determined to be "4004".
      In addition there are 2 x associated Result Code Qualifiers: "OM" and "OO".
      The solution recognises that only Qualifier "OO" is to be sent to the PNC (this is the only Qualifier in the results from Court which will be of interest to the PNC).
      PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC (the Result Code Qualifiers received from Court are also stripped from the update).

      MadeTech Definition:

      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  @NextUI
  Scenario: PNC is updated when there are multiple CCR and overlapping offences
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    Then I see trigger "PR10 - Conditional bail" in the exception list table
      And the PNC updates the record

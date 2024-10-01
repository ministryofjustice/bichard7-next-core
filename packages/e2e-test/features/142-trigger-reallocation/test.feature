Feature: {142} BR7 R5.2-RCD423-Trigger Reallocation

      """
      {142} BR7 R5.2-RCD423-Trigger Reallocation
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Trigger Reallocation where the Force Owner for a Case changes.
      Court Hearing results are received with an invalid ASN and the Force Owner is derived through the PTIURN.
      The Case creates an Exception and Pre Update Triggers. Ownership/visibility of this Case is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Exception/Trigger Records.
      Some Triggers are Completed, the invalid Arrest Summons Number is corrected and the Case resubmitted from the Portal.
      The query with the PNC finds a match and the Force Owner value is derived from information on the PNC.
      This results in a Force Owner change and therefore any unresolved Triggers are deleted and regenerated according to the new Force's rules.
      Ownership/visibility of this Case is then verified by logging in as Users belonging to Forces that SHOULD NOT and SHOULD be able to view the Exception/Trigger Records."

      MadeTech Definition:
      Trigger reallocation when a force owner changes

      Note: this test can't be run against the PNC because it requires the force used to insert the record to be changed.
      We can automate this in the future if we choose to.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  @ExcludeOnPreProd
  Scenario: Trigger reallocation when a force owner changes
    Given I am logged in as "norfolk.user"
      And I view the list of exceptions
    Then there are no exceptions or triggers
    When I am logged in as "essex.user"
      And I view the list of exceptions
    Then I see exception "HO100206" in the exception list table
    When I open the record for "Allocation Trigger"
      And I click the "Triggers" tab
    Then I see trigger "TRPR0004" for offence "2"
      And I see trigger "TRPR0004" for offence "3"
      And I see trigger "TRPR0006"
    When I click the "Notes" tab
    Then I see "Error codes: 1 x HO100206" in the table
      And I see "Trigger codes: 2 x TRPR0004, 1 x TRPR0006" in the table
    When I click the "Triggers" tab
      And I select trigger "1" to resolve
      And I click the "Mark Selected Complete" button
      And I see complete trigger "TRPR0004" for offence "2"
      And I click the "Defendant" tab
      And I correct "ASN" to "0836FP0100000377244A"
      And I click the "Offences" tab
      And I view offence "4"
      And I correct "Text" to "**Imprisonment for 12 Months with result text greater sixty fourEnd"
      And I submit the record
      And I reload until I don't see "(Submitted)"
      And I click the "Refresh" button
      And I return to the list
    Then there are no exceptions or triggers
    When I am logged in as "norfolk.user"
      And I view the list of exceptions
    Then I see trigger "PS03 - Disposal text truncated" in the exception list table
    When I open the record for "Allocation Trigger"
      And I click the "Notes" tab
    Then I see "Error codes: 1 x HO100206" in the table
      And I see "essex.user: Portal Action: Trigger Resolved. Code: TRPR0004" in the table
      And I see "essex.user: Portal Action: Update Applied. Element: ASN. New Value: 0836FP0100000377244A" in the table
      And I see "essex.user: Portal Action: Update Applied. Element: ResultVariableText. New Value: **Imprisonment for 12 Months with result text greater sixty fourEnd" in the table
      And I see "essex.user: Portal Action: Resubmitted Message" in the table
    When I click the "Triggers" tab
    Then I see trigger "TRPR0001" for offence "1"
      And I see trigger "TRPR0006"
      And I see trigger "TRPS0003" for offence "4"
      And I see complete trigger "TRPR0004" for offence "2"
      And the PNC updates the record
      And the audit log contains "Triggers generated"
      And the audit log contains "Trigger marked as resolved by user"

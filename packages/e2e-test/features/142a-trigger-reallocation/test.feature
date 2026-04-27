Feature: {142a} Trigger Reallocation

      """
      {142a} Trigger Reallocation
      ===============
      MadeTech Definition:
      Trigger reallocation when a force owner changes
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received with an invalid ASN

  @Must
  @NextUI
  @ExcludeOnPnc
  Scenario: Trigger reallocation when a force owner changes
    Given I am logged in as "met.police"
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
      And I correct "ASN" to "1201ZD0100000445099L"
      And I submit the record
      And I reload until I don't see "(Submitted)"
      And I click the "Refresh" button
      And I return to the list
    Then there are no exceptions or triggers
    When I am logged in as "met.police"
      And I view the list of exceptions
    When I open the record for "Allocation Trigger"
      And I click the "Notes" tab
    Then I see "Error codes: 1 x HO100206" in the table
      And I see "essex.user: Portal Action: Resolved Trigger. Code: PR04" in the table
      And I see "essex.user: Portal Action: Update Applied. Element: asn. New Value:" in the table
      And I see "essex.user: Portal Action: Resubmitted Message" in the table
    When I click the "Triggers" tab
    Then I see trigger "TRPR0006"
      And I see complete trigger "TRPR0004" for offence "2"
      And the PNC updates the record
      And the audit log contains "Triggers generated"
      And the audit log contains "Trigger marked as resolved by user"

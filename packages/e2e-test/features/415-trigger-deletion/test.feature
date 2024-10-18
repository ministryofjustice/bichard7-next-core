Feature: {415} Remove trigger codes from a case if triggers are deleted after resubmission

      """
      When both an exception and a trigger are raised on a case, and the user resolves the exception and resubmits the case without completing the trigger,
      if the trigger gets deleted after resubmission then it should be removed from the case.
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @NextUI
	@ExcludeOnLegacyUI
  Scenario: PNC is updated when there are multiple identical results
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		  And I see exception "HO100300" in the exception list table
			And I see trigger "PR18" in the exception list table
		When I go to the Case Details for this exception "HO100300"
			And I click the "Offences" tab
			And I view offence with text "Aggravated vehicle taking - ( driver did not take ) and vehicle damage of £5000 or over"
			And I correct "Next Hearing location" and type "Barb"
			And I select the first option
      And I submit the record
		When I return to the list
			And I reload until I don't see "(Submitted)"
      And I cannot see exception "HO100300" in the exception list table
			And I cannot see trigger "PR18" in the exception list table

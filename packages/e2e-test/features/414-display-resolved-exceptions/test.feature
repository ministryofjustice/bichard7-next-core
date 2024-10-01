Feature: {414} Persist Reason codes on a case list after the case is resolved.

    		"""
		When an exception is raised for a case, then we reolve the exception, and case is resubmitted.
		Then triggers are generated, once triggers are marked as complete, the case should have a "Resolved" state.
		When the case state filter is set to "Resolved," both exception code and trigger code should be visible under Reason column on a case list.
		The QA status column on old Bichard should remain empty (previously, a bug was generating question marks in that column).
    		"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	Scenario: Reason codes are displayed correctly once the case is resubmitted on Legacy Bichard
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open this record
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I submit the record
		When I return to the list
			And I reload until I don't see "(Submitted)"
		Then the PNC updates the record
		When I open this record
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then I search by state "Resolved"
			And I click the "Refresh" button
			And I see exception "HO100206" in the exception list table
			And I see trigger "PR18" in the exception list table
			And I cannot see trigger "??????" in the exception list table

	@NextUI
	@ExcludeOnLegacyUI
		Scenario: Reason codes are displayed correctly once the case is resubmitted on New Bichard
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open this record
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I submit the record
		When I return to the list
			And I reload until I don't see "(Submitted)"
		Then the PNC updates the record
		When I open this record
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then I add a checkmark to "resolved"
		Then I click the "Apply filters" button
			And I see exception "HO100206" in the exception list table
			And I see trigger "PR18" in the exception list table

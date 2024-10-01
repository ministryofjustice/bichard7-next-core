Feature: {413} Display correct number of triggers after case is resubmitted on Old Bichard

    		"""
    	When an exception is raised for a case, then resolved, and the case is resubmitted. Then, if the case has triggers, it should display the correct number of triggers on the trigger tab.
    		"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Must
	@Parallel
	Scenario: PNC is updated when there are multiple identical results
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open this record
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I submit the record
		When I return to the list
			And I reload until I don't see "(Submitted)"
			And I search by state "Resolved"
			And I click the "Refresh" button
		Then the PNC updates the record
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0018" for offence "1"
		Then I see trigger "TRPR0018" for offence "2"
		Then I see trigger "TRPR0018" for offence "3"

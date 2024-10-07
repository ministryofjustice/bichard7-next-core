Feature: {032} 3.2 UAT - TIC Change

			"""
			{032} 3.2 UAT - TIC Change
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test (from UAT) verifying Offences Taken Into Consideration handling.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing details of Offences Taken Into Consideration both as a Result Code Qualifier (J) and as a Result Code (3118).
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A PRE Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			This tests that Offences Taken Into Consideration cause the PNC to be updated and a trigger to be raised.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Offences Taken Into Consideration update PNC and raise a trigger
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "Bethel Barry"
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record

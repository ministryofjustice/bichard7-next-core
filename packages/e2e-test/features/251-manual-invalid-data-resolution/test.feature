Feature: {251} BR7 R3.2-UAT-Wrong Offence or Court Code

			"""
			{251} BR7 R3.2-UAT-Wrong Offence or Court Code
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Exception generation, Trigger generation and invalid data handling:
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			An Exception and Trigger are created.
			The Exception highlights the fact that invalid data (Offence Code and Court Hearing Location values) has been sent from Court.
			Since the Portal permits only a limited set of updatable fields (and the invalid values received from Court cannot be updated) the resolution to the Exception must be one that is manually/directly updated on the PNC.
			The Exception records and Trigger record are all Marked as Complete.

			MadeTech Definition:
			Manual invalid data resolution
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Manual invalid data resolution
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
		When I open the record for "Burnham Lester"
		Then I see error "HO100300" in the "Court location" row of the results table
		When I click the "Defendant" tab
		Then I see error "HO100304" in the "ASN" row of the results table
		When I click the "Offences" tab
			And I view offence "1"
		Then I see error "HO100306" in the "Offence Code" row of the results table
		When I click the "Triggers" tab
		Then I see trigger "TRPR0006"
		When I resolve all of the triggers
			And I unlock the record and return to the list
		Then there are no triggers raised for "Burnham Lester"
			And the PNC record has not been updated

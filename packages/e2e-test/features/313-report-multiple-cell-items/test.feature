Feature: {313} BR7-R5.10-RCD667-Revise display of report content where multiple items are present in a single cell

			"""
			{313} BR7-R5.10-RCD667-Revise display of report content where multiple items are present in a single cell
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying improvments to the display of report content where multiple items are present in a single cell namely that there is a blank space/line between mutiple items in the same cell

			MadeTech Definition:
			Displaying report with multiple items in a cell
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@ExcludedOnConductor
	Scenario: Displaying report with multiple items in a cell
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100300" in the exception list table
		When I fake the data for the Live Status Detail - Exceptions report
			And I click the "Reports" menu button
			And I access the "Live Status Detail - Exceptions" report
		Then the Live Status Detail - Exceptions report is correct
		When I view the list of exceptions
			And I open the record for "Burnham Lester"
			And I click the "Triggers" tab
			And I manually resolve the record
			And I click the "Reports" menu button
			And I access the "Resolved Exceptions" report
			And I generate today's report
			And I download the report
		Then the "ResolvedExceptions.csv" report will be downloaded as a CSV file
			And the Resolved Exceptions report is correct
			And the PNC record has not been updated

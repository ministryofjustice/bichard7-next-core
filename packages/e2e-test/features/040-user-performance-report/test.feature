Feature: {040} 04 MIS - User Performance Summary

			"""
			{040} 04 MIS - User Performance Summary
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying a specific Operational Report providing a live summary allowing a manager to prioritise resources on those Triggers that are approaching "overdue" status, and shows which are actually overdue (i.e.
			failed to have been actioned within 24h of receipt)

			MadeTech Definition:
			Generating the user performance report

			Note: this test does not run against the Host 9 PNC because it uses the same records as other tests so would clash
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message-1" is received

	@Could
	@ExcludeOnPreProd
	Scenario: Generating the user performance report
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		When I open the record for "SEXOFFENCE TRPRFOUR"
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Given "input-message-2" is received
			And I am logged in as "exceptionhandler"
			And I view the list of exceptions
		When I open the record for "Bass Barry"
			And I click the "Offences" tab
			And I view offence "1"
			And I correct "Sequence Number" to "1"
			And I click the "Offences" tab
			And I view offence "2"
			And I correct "Sequence Number" to "2"
			And I click the "Offences" tab
			And I submit the record
			And the PNC updates the record
		When I am logged in as "triggerhandler"
			And I view the list of exceptions
			And I open the record for "Bass Barry"
		When I am logged in as "supervisor"
			And I view the list of exceptions
			And I click the "Reports" menu button
			And I access the "User Performance Summary" report
		Then the user performance summary report is correct

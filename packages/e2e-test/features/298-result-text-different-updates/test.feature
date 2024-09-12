Feature: {298} BR7-R5.9-RCD545-Duplicate Offences-DIFFERENT Results-Result Text forced from Portal

			"""
			{298} BR7-R5.9-RCD545-Duplicate Offences-DIFFERENT Results-Result Text forced from Portal
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and Result Text/PNC Disposal Text handling.
			Court Hearing Results are received from Magistrates Court where:
			- Identical Offences are present
			- The Results include Result Text that ISNT used to generate PNC Disposal Text
			- The Results for each Identical Offence are DIFFERENT
			The Bichard7 solution is unable to determine which PNC Offence should be updated (Identical Offences received from Court with different Results) so an Exception is created.
			The Exception is resolved on the Portal via data update and record resubmission.
			At the same time the Result Text is manually 'forced' into becoming part of the update to the PNC (pre-pending the Result Text on the Portal with '**').
			PNC Exception Update is generated and the Court Hearing Results with portal-added values (Offence Sequence Numbers and Result Text details) are successfully added onto the PNC.

			MadeTech Definition:
			Updating the PNC after resolving the exception with result text not used for disposal text
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Updating the PNC after resolving the exception with result text not used for disposal text
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100310 (2)" in the exception list table
		When I open the record for "RESULTTEXTFORCED DUPLICATEOFFENCES"
			And I click the "Offences" tab
			And I view offence "1"
			And I correct "Sequence Number" to "1"
			And I prepend "Text" with "**"
			And I click the "Offences" tab
			And I view offence "2"
			And I correct "Sequence Number" to "2"
			And I prepend "Text" with "**"
			And I click the "Offences" tab
		When I submit the record
		Then the PNC updates the record

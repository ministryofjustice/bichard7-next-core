Feature: {297} BR7-R5.9-RCD545-Duplicate Offences-DIFFERENT Result Text ISNT used as PNC Disposal Text

			"""
			{297} BR7-R5.9-RCD545-Duplicate Offences-DIFFERENT Result Text ISNT used as PNC Disposal Text
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and Result Text/PNC Disposal Text handling.
			Court Hearing Results are received from Magistrates Court where:
			- Identical Offences are present
			- The Results include Result Text that ISNT used to generate PNC Disposal Text
			- The Result Text for each Identical Offence is DIFFERENT
			Whilst the Results from Court are technically different the Bichard7 solution determines that the updates will essentially be the same, i.e.
			the differences in Result Text are immaterial since they will not form part of the update to the PNC.
			Therefore NO Exception is generated and instead the Results from Court are successfully and automatically added to the PNC.
			No PRE and POST Update Triggers are created on the Portal either.

			MadeTech Definition:
			No exceptions are generated when the result text is the same and PNC is updated
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: No exceptions are generated when the result text is the same and PNC is updated
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record

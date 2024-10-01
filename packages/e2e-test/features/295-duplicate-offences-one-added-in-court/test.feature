Feature: {295} BR7-R5.9-RCD545-Duplicate Offences where 1 Offence is Added In Court-DIFFERENT Result Text IS used as PNC Disposal Text

			"""
			{295} BR7-R5.9-RCD545-Duplicate Offences where 1 Offence is Added In Court-DIFFERENT Result Text IS used as PNC Disposal Text
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and Result Text/PNC Disposal Text handling.
			Court Hearing Results are received from Magistrates Court where:
			- Identical Offences are present
			- The Results include Result Text that IS used to generate PNC Disposal Text
			- The Result Text for each Identical Offence is DIFFERENT
			- One of the Offences has actually been Added In Court (i.e.
			is not on the PNC)
			The Bichard7 solution is unable to determine which PNC Offence should be updated (Identical Offences received from Court with different Result Text that IS used to generate PNC Disposal Text) so an Exception is created.
			The Exception is resolved on the Portal via data update and record resubmission.
			PNC Exception Update is generated and the Court Hearing Results with portal-added values (Offence Sequence Numbers) are successfully added onto the PNC.
			PRE Update Triggers are also successfully created on the Portal.

			MadeTech Definition:
			Updating duplicate offences when one offence is added in court and making sure the result text is used as the PNC disposal text
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Updating duplicate offences when one offence is added in court and making sure the result text is used as the PNC disposal text
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100310 (2)" in the exception list table
		When I open the record for "RESULTTEXTISUSED DUPLICATEOFFENCEADDEDINCOURT"
			And I click the "Offences" tab
			And I view offence "1"
			And I match the offence to PNC offence "1"
			And I return to the offence list
			And I view offence "2"
			And I match the offence as Added In Court
			And I submit the record
		Then the PNC updates the record
		When I reload until I see "PS03 - Disposal text truncated"
			And I open the record for "RESULTTEXTISUSED DUPLICATEOFFENCEADDEDINCOURT"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0003" for offence "2"
			And I see trigger "TRPS0003" for offence "1"
			And I see trigger "TRPS0003" for offence "2"
			And I see trigger "TRPS0010" for offence "2"

Feature: {173} BR7 R5.3-RCD497 - Partial Match - Fine Amount

			"""
			{173} BR7 R5.3-RCD497 - Partial Match - Fine Amount
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Identical Offence Matching where different Results are received and the Court Offence Dates are within the date range of the matching PNC Offence.
			Specifically:
			- Offences 1 and 2 are identical but the Results received from Court are not (Fines of different amounts are imposed as part of Sentencing)
			The solution cannot automatically update the PNC since there is no way to uniquely determine which Result belongs to which Offence on the PNC and therefore an Exception is generated.
			PNC Exception Update is generated and the Court Hearing Results with portal-added values (Offence Sequence Numbers) are successfully added onto the PNC.
			Pre Update Triggers are created on the Portal.

			MadeTech Definition:
			Handling exceptions for identical offences with manual handling
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Handling exceptions for identical offences with manual handling
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see exception "HO100310 (2)" in the exception list table
		When I open the record for "Pinkerton Marcus"
			And I click the "Offences" tab
			And I view offence "1"
			And I match the offence to PNC offence "1"
			And I return to the offence list
			And I view offence "2"
			And I match the offence to PNC offence "2"
			And I return to the offence list
			And I submit the record
		Then the PNC updates the record
		When I reload until I don't see "(Submitted)"
			And I open the record for "Pinkerton Marcus"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0018" for offence "1"
			And I see trigger "TRPR0018" for offence "2"

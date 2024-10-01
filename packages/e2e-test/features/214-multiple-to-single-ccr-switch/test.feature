Feature: {214} BR7 R5.4-RCD471-Multiple CCR to Single CCR switch between PNC submissions

			"""
			{214} BR7 R5.4-RCD471-Multiple CCR to Single CCR switch between PNC submissions
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Hearing Results automation where ASN changes are made that result from a case switching from containing multiple CCRs on the PNC to a single CCR on the PNC during submissions from the solution to the PNC.
			A Case containing multiple CCR Groups is present on the PNC (Offences are to be heard in different Courts).
			Court Hearing Results are received which generates an Exception on the Portal.
			The Case on the PNC is then Merged such that all Offences are part of a single CCR Group (Offences are to all to be heard in the same Court at the same Hearing).
			The Exception on the Portal is corrected and then resubmitted and the PNC is successfully updated.
			Pre and Post Update Triggers are also generated on the Portal.

			MadeTech Definition:
			Switching from a multiple CCR to a single CCR case between submissions
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Switching from a multiple CCR to a single CCR case between submissions
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100209" in the exception list table
		When I open the record for "TOSINGLECCRX MULTIPLECCR"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000445720M"
			And I correct "Court PNCID" to "2012/0000029N"
			And I submit the record
			And the PNC updates the record
		When I reload until I see "PS02 - Check address"
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PR21 - Disq. non-motoring" in the exception list table

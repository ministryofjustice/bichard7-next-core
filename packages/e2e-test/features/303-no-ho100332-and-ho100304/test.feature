Feature: {303} BR7-R5.9-RCD609-HO100332 and HO100304 combination no longer possible

			"""
			{303} BR7-R5.9-RCD609-HO100332 and HO100304 combination no longer possible
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group processing where there are multiple instances of the same Offence across more than 1x CCR Group AND a mismatch of Offences between those on the PNC and those Offences received from Court.
			The BR7 solution is not able to uniquely identify a match between PNC Offence and Court Offence in order to provide an automated update (since the same Offence exists in more than 1 x CCR Group) and so instead an Exception is created for manual resolution.
			However, only HO100332 (Offences match more than one CCR Group) is generated and HO100304 is NOT produced (since a match against CCR Group is not possible it is therefore not possible to reliably determine whether there are unmatched offences).
			NO PNC Update is generated.
			Pre Update Triggers are created.

			MadeTech Definition:
			HO100332 and HO100304 is not possible
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: HO100332 and HO100304 is not possible
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see exception "HO100332" in the exception list table
			And I cannot see exception "HO100304" in the exception list table
		When I open the record for "AVALON MARTIN"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see error "HO100332 - Offences match more than one CCR" in the "Sequence Number" row of the results table
		When I click the "Offences" tab
			And I view offence "3"
		Then I see error "HO100332 - Offences match more than one CCR" in the "Sequence Number" row of the results table
			And the PNC record has not been updated

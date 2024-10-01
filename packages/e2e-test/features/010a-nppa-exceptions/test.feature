Feature: {010} R2_Regression_NPPA_NPP_001 - part 1

			"""
			{010} R2_Regression_NPPA_NPP_001
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Non Police Prosecuting Authority (NPPA) Court Results and Exception generation.
			NPPA Court Hearing Results are sent through the CJSE and onto Bichard7 containing a recordable offence generating an Exception on the Portal and no PNC Update.
			An additional NPPA Court Hearing Result is sent through the CJSE and onto Bichard7 containing no recordable offences/results which results in the solution ignoring the results (since PNC has no interest) and logging the message to the General Event Log.

			MadeTech Definition:
			NPPA exception generation
			"""

	Background:
		Given "input-message" is received

	@Could @NextUI
	Scenario: NPPA exception generation
		Given I am logged in as "herts.user"
			And I view the list of exceptions
		Then I see exception "HO100321" in the exception list table
			And no PNC requests have been made

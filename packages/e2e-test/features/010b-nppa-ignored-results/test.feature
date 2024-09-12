Feature: {010} R2_Regression_NPPA_NPP_001 - part 2

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

	@Could
	@AuditLog
	@NextUI
	Scenario: NPPA exception generation
		Given I am logged in as "wilt.shire"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And no PNC updates have been made
			And the audit log contains "Hearing Outcome ignored as no offences are recordable"

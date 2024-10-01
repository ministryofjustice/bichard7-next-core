Feature: {144} BR7 R5.2-RCD491-TRPR0008 BA76005 Not Guilty

			"""
			{144} BR7 R5.2-RCD491-TRPR0008 BA76005 Not Guilty
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach of Bail handling where the Verdict from Court is Not Guilty.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			An Exception and Pre Update Triggers are created - however, the Breach of Bail Trigger is not created.

			MadeTech Definition:
			Handling breach of bail when not guilty
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Could
	@PreProdTest
	Scenario: Handling breach of bail when not guilty
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100301" in the exception list table
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PR21 - Disq. non-motoring" in the exception list table
			And I cannot see trigger "PR08 - Breach of bail" in the exception list table

Feature: {232} BR7 R5.5-RCD544-Non-Recordable-Personal Details Change and other Pre Update Triggers

			"""
			{232} BR7 R5.5-RCD544-Non-Recordable-Personal Details Change and other Pre Update Triggers
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the 'Personal Details changes' Trigger where other Pre Update Triggers are to be generated and the Case is considered to be Non-Recordable.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The Case contains no Recordable Offences and there is no matching Impending Prosecution Record on the PNC.
			The Case is (purposely) ignored by the solution but the Personal Details changes Trigger is generated alongside other Pre Update Triggers.

			MadeTech Definition:
			Non-recordable personal details change
			"""

	Background:
		Given "input-message" is received

	@Could @NextUI
	Scenario: Non-recordable personal details change
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And I see trigger "PR15 - Personal details changed" in the exception list table
			And there are no exceptions
			And no PNC requests have been made

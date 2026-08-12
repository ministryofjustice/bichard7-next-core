Feature: {504} 504-different-defendant-name-in-hearing-outcome

			"""
			MadeTech Definition:
			Ensure that LEDS is updated when an incoming court message contains different defendant name for the same case, provided the ASN matches. In this test, LEDS contains the defendant name William Brown, while the incoming court message contains Paul Smith. The expected behaviour is that Bichard successfully updates LEDS despite the name difference.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	@LedsPreProdTest
	Scenario: Updates and triggers are correctly generated for sexual offences
		Given I am logged in as "supervisor"
		When I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions for this record

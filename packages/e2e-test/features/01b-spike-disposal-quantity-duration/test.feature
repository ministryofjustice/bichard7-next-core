Feature: {01b} Spike - Phase 1 adjudications and disposals with quantity duration

    """
    This tests Phase 1 integration with LEDS simulator where offences with adjudications
    and disposals are returned with the disposal included quantity duration.

    Based on {160} BR7 R5.3-RCD482 - Offence added in court - No HO200124
    """

    Background:
        Given the data for this test is in LEDS

    @Could @NextUI
    Scenario: Handling offences added in court
        Given "input-message-2" is received
            And I am logged in as "supervisor"
            And I view the list of exceptions
        Then I see trigger "PR06 - Imprisoned" in the exception list table

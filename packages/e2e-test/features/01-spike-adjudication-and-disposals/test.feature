Feature: {01} Spike - Phase 1 adjudications and disposals

    """
    This tests Phase 1 integration with LEDS simulator where offences with adjudications
    and disposals are returned.

    Based on {028} R5.6_BR7 Driver Disqualification - Duration and Date values
    """

    Background:
        Given the data for this test is in LEDS

    @Should @NextUI
    Scenario: Driver Disqualification handling when only a Duration is received
        Given I am logged in as "supervisor"
        When "input-message-2" is received
            And I view the list of exceptions
        Then I see trigger "PR01 - Disqualified driver" in the exception list table
            And there are no exceptions raised for "Jimbobjones Bobby"

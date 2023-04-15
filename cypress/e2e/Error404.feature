Feature: Error404 page
    As a user
    I want to see an error page when I navigate to a page that does not exist
    So that I know that the page I am looking for cannot be found

    Scenario: User navigates to a non-existent page
        Given I am a user
        When I navigate to a non-existent page
        Then I see the Error404 page
        And I can click on the Go Home button

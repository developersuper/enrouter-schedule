Feature: Logout
    As a logged in user
    I want to be able to log out
    So that I can secure my account

    Background:
        Given I am on the dashboard page
        And I am logged in

    Scenario: Successful logout
        When I click on the profile dropdown
        And I click on the Logout button
        Then I should be redirected to the login page
        And I should be logged out

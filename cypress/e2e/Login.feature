Feature: Login
    As a user
    I want to be able to log in
    So that I can access my account

    Background:
        Given I am on the login page

    Scenario: Successful login
        When I enter my email "kyle@ontracktech.io"
        And I enter my password "P1o&^AhvTrIkT8QtNZAEx%TF^4FK1Oh72NhRc"
        And I click the login button
        Then I should be redirected to the dashboard

    Scenario: Incorrect password
        When I enter my email "kyle@ontracktech.io"
        And I enter my password "wrongpassword"
        And I click the login button
        Then I should see an alert with the message "Wrong password"

    Scenario: User Doesn't exist
        When I enter my email "kyle@fisbgaubsurgbgu.io"
        And I enter my password "wrongpassword"
        And I click the login button
        Then I should see an alert with the message "User not found"

    Scenario: No email or password
        Then I should see the login button is disabled
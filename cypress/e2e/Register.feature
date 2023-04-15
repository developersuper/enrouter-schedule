Feature: Register User
    As a user
    I want to register for an account
    So that I can access the app

    Scenario: Successful registration
        Given I am on the register page
        When I enter valid registration details
        And I submit the registration form
        Then I should see a success message
        And I should be redirected to the home page
        Then I should see no appointments exist
        And I should see the dashboard button Setup Schedule
        Then I should not see turn on
        And I should see an alert to confirm my email
        Then I should see an alert to upgrade my account

    Scenario: Invalid email
        Given I am on the register page
        When I enter an invalid details
        And I submit the registration form
        Then I should see an error message
        And I should stay on the registration page

    Scenario: Passwords do not match
        Given I am on the register page
        When I enter valid registration details
        And I submit the registration form
        Then I should see an error message
        And I should stay on the registration page


    Scenario: Email address already registered
        Given I am on the register page
        When I fill out the registration form with an already registered email address
        And I submit the registration form
        Then I should see an error message
        And I should stay on the registration page

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import MainLayoutPage from "../../support/pageObjects/MainLayout";

const mainLayoutPage = new MainLayoutPage();

Given("I am on the dashboard page and am logged in", () => {
  //go to login and login
  cy.visit("/auth/login");
  cy.get('[data-test-id="email-input"]').type("kyle@ontracktech.io");
  cy.get('[data-test-id="password-input"]').type(
    "P1o&^AhvTrIkT8QtNZAEx%TF^4FK1Oh72NhRc"
  );
  cy.get('[data-test-id="login-button"]').click();
  //go to dashboard
  cy.visit("/");
});

When("I click on the profile dropdown", () => {
  mainLayoutPage.getProfileDropdown().click();
});

When("I click on the Logout button", () => {
  mainLayoutPage.getLogoutButton().click();
});

Then("I should be redirected to the login page", () => {
  cy.url().should("include", "/auth/login");
});

Then("I should be logged out", () => {
  // Ensure that auth.currentUser.uid is null, which indicates that the user is logged out
  cy.url().should("include", "/auth/login");
});

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import RegisterPage from "../../support/pageObjects/Register";
import Dashboard from "../pageObjects/Dashboard";

const registerUserPage = new RegisterPage();
const dashboard = new Dashboard();

Given("I am on the register page", () => {
  registerUserPage.visit();
});

When("I enter valid registration details", () => {
  registerUserPage.enterName("John Smith");
  registerUserPage.enterEmail(`noreply+${Date.now()}@prorouting.ai`);
  registerUserPage.enterPassword("testpassword");
  registerUserPage.enterPassword2("testpassword");
});

When("I submit the registration form", () => {
  registerUserPage.submitRegistrationForm();
});

When("I click the register button", () => {
  registerUserPage.submitRegistrationForm();
});

Then("I should see a success message", () => {
  registerUserPage.getSuccessMessage().should("be.visible");
});

Then("I should be redirected to the home page", () => {
  cy.url().should("eq", "http://localhost:8080/");
});

Then("I should see no appointments exist", () => {
  dashboard.shouldSayNoUpcomingAppointments();
});

Then("I should see the dashboard button Setup Schedule", () => {
  dashboard.shouldSaySetupSchedule;
});

Then("I should not see turn on", () => {
  dashboard.getTurnOnSchedule;
});

Then("I should see an alert to confirm my email", () => {
  dashboard.getVerifyEmailAlert();
});

Then("I should see an alert to upgrade my account", () => {
  dashboard.getPlanAlert("free");
});

Then("I should see an error message", () => {
  registerUserPage.getErrorMessage();
});

Then("I should stay on the registration page", () => {
  registerUserPage.getRegisterButton();
});

When("I fill out the registration form without an email address", () => {
  registerUserPage.enterName("John Smith");
  registerUserPage.enterPassword("testpassword");
  registerUserPage.enterPassword2("testpassword");
});

Then("I should see an error message indicating an invalid email", () => {
  registerUserPage.getErrorMessage().should("be.visible");
  registerUserPage
    .getErrorMessage()
    .contains("Invalid email")
    .should("be.visible");
});

When("I enter an invalid details", () => {
  registerUserPage.enterName("John Smith");
  registerUserPage.enterEmail(`john.smith.${Date.now()}example.com`);
  registerUserPage.enterPassword("password1");
  registerUserPage.enterPassword2("password1");
});

When("I fill out the registration form with mismatched passwords", () => {
  registerUserPage.enterName("John Smith");
  registerUserPage.enterEmail(`qa.test.${Date.now()}@example.com`);
  registerUserPage.enterPassword("password1");
  registerUserPage.enterPassword2("password2");
});

Then(
  "I should see an error message indicating that passwords do not match",
  () => {
    registerUserPage.getErrorMessage().should("be.visible");
    registerUserPage
      .getErrorMessage()
      .contains("Passwords do not match")
      .should("be.visible");
  }
);

When(
  "I fill out the registration form with an already registered email address",
  () => {
    registerUserPage.enterName("John Kim");
    registerUserPage.enterEmail("jkim@prorouting.ai");
    registerUserPage.enterPassword("testpassword");
    registerUserPage.enterPassword2("testpassword");
  }
);

Then(
  "I should see an error message indicating that the email address is already registered",
  () => {
    registerUserPage.getErrorMessage().should("be.visible");
    registerUserPage
      .getErrorMessage()
      .contains("Email address already registered")
      .should("be.visible");
  }
);

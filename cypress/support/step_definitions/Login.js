import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import LoginPage from "../../support/pageObjects/Login";

const loginPage = new LoginPage();

Given("I am on the login page", () => {
  cy.visit("/auth/login");
});

When("I enter my email {string}", (email) => {
  loginPage.getEmailInput().type(email);
});

When("I enter my password {string}", (password) => {
  loginPage.getPasswordInput().type(password);
});

When("I click the login button", () => {
  loginPage.getLoginButton().click();
});

When("I enter my email {string}", (email) => {
  loginPage.getEmailInput().type(email, { delay: 50 });
});

When("I enter my password {string}", (password) => {
  loginPage.getPasswordInput().type(password, { delay: 50 });
});

When("I click the login button", () => {
  loginPage.getLoginButton().click();
});

Then("I should see an alert with the message {string}", (message) => {
  cy.get(".q-notification__content").should("contain", message);
});

Then("I should be redirected to the dashboard", () => {
  cy.url().should("be", "/");
});

Then("I should see the login button is disabled", () => {
  //check button is disabled
  loginPage.getLoginButton().should("be.disabled");
});

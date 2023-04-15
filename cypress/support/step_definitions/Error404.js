import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import Error404Page from "../../support/pageObjects/Error404";

Given("I am a user", () => {});

When("I navigate to a non-existent page", () => {
  cy.visit("/some/non-existent/page");
});

Then("I see the Error404 page", () => {
  Error404Page.errorTitle.should("have.text", "Oops. Nothing here...");
});

And("I can click on the Go Home button", () => {
  Error404Page.goHomeButton.click();
  cy.url().should("eq", "http://localhost:8080/");
});

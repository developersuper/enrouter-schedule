import "@testing-library/cypress/add-commands";

import RegisterPage from "../support/pageObjects/Register";

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/auth/login");
  cy.get('input[placeholder="Email"]').type(email);
  cy.get('input[placeholder="Password"]').type(password);
  cy.get('button[label="Log In"]').click();
  cy.url().should("be", "/");
});

Cypress.Commands.add("registerWithCredentials", (name, email) => {
  cy.visit("/register");
  RegisterPage.enterName(name);
  RegisterPage.enterEmail(email);
  RegisterPage.clickRegister();
});

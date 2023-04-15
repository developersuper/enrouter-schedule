export default class RegisterPage {
  visit() {
    cy.visit("/auth/register");
  }

  enterName(name) {
    cy.get("[data-test-id=name-input]").type(name);
  }

  enterEmail(email) {
    cy.get("[data-test-id=email-input]").type(email);
  }

  enterPassword(password) {
    cy.get("[data-test-id=password-input]").eq(0).type(password);
  }

  enterPassword2(password) {
    cy.get("[data-test-id=password-input]").eq(1).type(password);
  }

  submitRegistrationForm() {
    cy.get("[data-test-id=button]").click();
  }

  getSuccessMessage() {
    return cy.contains("Account created successfully");
  }

  getErrorMessage() {
    return cy.get(".q-notification").should("be.visible");
  }

  getEmailValidationMessage() {
    return cy.contains("Invalid email").should("be.visible");
  }

  getPasswordValidationMessage() {
    return cy.contains("Passwords do not match").should("be.visible");
  }

  getExistingEmailErrorMessage() {
    return cy.contains("Email address already registered").should("be.visible");
  }

  getRegistrationTitle() {
    return cy.get("[data-test-id=register-title]");
  }

  getEmailInput() {
    return cy.get("[data-test-id=email-input]");
  }

  getNameInput() {
    return cy.get("[data-test-id=name-input]");
  }

  getPasswordInput() {
    return cy.get("[data-test-id=password-input]").eq(0);
  }

  getPasswordInput2() {
    return cy.get("[data-test-id=password-input]").eq(1);
  }

  getShowPasswordButton() {
    return cy.get("[data-test-id=password-input] .q-field__append").eq(0);
  }

  getShowPasswordButton2() {
    return cy.get("[data-test-id=password-input] .q-field__append").eq(1);
  }

  getRegisterButton() {
    return cy.get("[data-test-id=button]");
  }

  getLoginLink() {
    return cy.get("[data-test-id=register-login-link]");
  }
}

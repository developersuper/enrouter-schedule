export default class LoginPage {
  getEmailInput() {
    return cy.get('[data-test-id="email-input"]');
  }

  getPasswordInput() {
    return cy.get('[data-test-id="password-input"]');
  }

  getLoginButton() {
    return cy.get('[data-test-id="login-button"]');
  }
}

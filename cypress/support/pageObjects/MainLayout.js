export default class MainLayoutPage {
  getProfileDropdown() {
    return cy.get('[data-test-id="profile-dropdown"]');
  }

  getLogoutButton() {
    return cy.get('[data-test-id="logout-button"]');
  }
}

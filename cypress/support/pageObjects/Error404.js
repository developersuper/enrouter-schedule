class Error404Page {
  get errorTitle() {
    return cy.get(".text-h2");
  }

  get goHomeButton() {
    return cy.get(".q-btn");
  }
}

export default new Error404Page();

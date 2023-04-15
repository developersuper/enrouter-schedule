export default class Dashboard {
  getVerifyEmailAlert() {
    return cy.contains("Verify Your Email").should("be.visible");
  }

  getPlanAlert(type) {
    if (type === "free") {
      return cy
        .contains(
          "You are on the free plan. A max of 10 appointments can be booked per month"
        )
        .should("be.visible");
    } else if (type === "lite") {
      return cy
        .contains(
          "Upgrade to Premium to optimize your availability with SmartSchedule"
        )
        .should("be.visible");
    } else {
      return cy.get("[data-test-id=upgrade-alert]").should("not.exist");
    }
  }

  getTurnOnSchedule() {
    return (
      cy.contains("Turn on").should("not.exist") &&
      cy.contains("Turn off").should("not.exist")
    );
  }

  shouldSayNoUpcomingAppointments() {
    return (
      cy.contains("No upcoming appointments").should("be.visible") &&
      cy.contains("Your upcoming appointments (0)").should("be.visible")
    );
  }

  shouldSaySetupSchedule() {
    return cy.contains("Setup Schedule").should("be.visible");
  }
}

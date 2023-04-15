const { APIClient, SendEmailRequest } = require("customerio-node");
const client = new APIClient("8b553d91c20dff38a1f8fa78f679a137");
const { AppointmentCreated } = require("./templates/AppointmentCreated");

const SendEmail = async (type, user, data) => {
  try {
    switch (type) {
      case "appointment_created":
        //send email request with body returned from appointmentcreated
        const req = new SendEmailRequest({
          to: user.email,
          transactional_message_id: type,
          body: AppointmentCreated(data),
          identifiers: {
            id: user.email,
          },
        });

        client
          .sendEmail(req)
          .then((res) => console.log(res))
          .catch((err) => console.log(err.statusCode, err.message));
        return { success: true };

      default:
        const request = new SendEmailRequest({
          to: user.email,
          transactional_message_id: type,
          message_data: {
            customer: {
              first_name: user.first_name,
              email: user.email,
              uid: user.uid,
              id: user.uid,
            },
          },
          identifiers: {
            id: user.uid,
          },
        });

        client
          .sendEmail(request)
          .then((res) => console.log(res))
          .catch((err) => console.log(err.statusCode, err.message));
        return { success: true };
    }
  } catch (e) {
    console.error(e);
    return { success: false };
  }
};

module.exports = {
  EmailController: {
    SendEmail,
  },
};

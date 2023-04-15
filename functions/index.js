const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const axios = require("axios");

const { MapController } = require("./api/maps/maps");
const { EmailController } = require("./api/user/email");
const { BillingController } = require("./api/billing/billing");

admin.initializeApp();

const db = admin.firestore();
const api = express();

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

api.use(
  cors({
    origin: true,
  })
);
api.options("*", cors());
api.use(
  bodyParser.raw({
    verify: rawBodyBuffer,
    type: "*/*",
  })
);

api.get("/maps/similar-zipcodes", async (req, res) => {
  const { zipcode, radius } = req.body;
  await MapController.GetZipCodesInRadius(zipcode, radius);
});

api.post("/verify", async (req, res) => {
  const { email } = req.body;
  try {
    //update this email as verified in firebase admin
    admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        admin.auth().updateUser(userRecord.uid, {
          emailVerified: true,
        });
      });
    return res.status(200).send("success");
  } catch (e) {
    return res.send({ success: false });
  }
});

api.post("/reserve-link", async (req, res) => {
  const { username } = req.body;
  try {
    // Define the headers
    const headers = {
      "Content-Type": "application/json",
      apiKey: "fcc8ac0916364e11b6903c2321d3e748",
    };

    // Define the options object with headers and other data
    const options = {
      method: "POST",
      url: "https://api.rebrandly.com/v1/links",
      headers: headers,
      data: {
        title: "Book A Meeting",
        slashtag: username,
        destination: `https://app.prorouting.ai/s/${username}`,
        domain: { id: "4e9e816b702a43e6b0fdcc2417cd5b15" },
      },
    };

    // Send the axios request with the options object
    const response = await axios(options);
    console.log("response", response.data);
    return res.send({ success: true });
  } catch (error) {
    console.error(error);
    return res.send({ success: false });
  }
});

api.post("/email/send", async (req, res) => {
  const { type, data, user } = req.body;
  const response = await EmailController.SendEmail(type, user, data);
  return res.status(200).send(response);
});

api.get("/billing/subscription/:id", async (req, res) => {
  const { id } = req.params;
  const response = await BillingController.GetSubscription(id);
  return res.status(200).send(response);
});

api.get("/billing/portal/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  const response = await BillingController.GenerateStripePortal(customer_id);
  return res.status(200).send(response);
});

api.post("/billing/checkout", async (req, res) => {
  const { email, plan, frequency, client_reference_id } = req.body;
  const response = await BillingController.CreateStripeCheckout(
    email,
    plan,
    frequency,
    client_reference_id
  );
  return res.status(200).send(response);
});

api.post("/billing/stripe", async (req, res) => {
  let event = req.body;

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntent = event.data.object;
      const email = paymentIntent.customer_details.email;

      const userRef = db.collection("users");

      var subscription = {
        amount_total: paymentIntent.amount_total,
        subscription: paymentIntent,
      };

      admin
        .auth()
        .getUserByEmail(email)
        .then(async (userRecord) => {
          await userRef
            .doc(userRecord.uid)
            .update({
              subscription,
            })
            .then((subscription) => {
              console.log("Successfully subscription updated:", subscription);
            })
            .catch(async (error) => {
              await userRef
                .doc(userRecord.uid)
                .set({
                  date: new Date(),
                  email,
                  subscription,
                })
                .then((subscription) => {
                  console.log(
                    "Successfully subscription created:",
                    subscription
                  );
                })
                .catch((error) => {
                  console.log("Error creating subscription object:", error);
                });
            });
        })
        .catch(async (error) => {
          await admin
            .auth()
            .createUser({
              email: email,
              emailVerified: true,
              password: "P1o&^AhvTrIkT8QtNZAEx%TF^4FK1Oh72NhRc",
              disabled: false,
              subscription: {
                id: paymentIntent.id,
                amount: paymentIntent.amount_total,
              },
            })
            .then(async (userRecord) => {
              await userRef
                .doc(userRecord.uid)
                .set({
                  date: new Date(),
                  email,
                  subscription,
                })
                .then((subscription) => {
                  console.log(
                    "Successfully subscription updated:",
                    subscription
                  );
                })
                .catch((error) => {
                  console.log("Error creating subscription object:", error);
                });
              console.log("Successfully created new user:", userRecord.uid);
            })
            .catch((error) => {
              console.log("Error creating new user:", error);
            });
        });
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.trial_will_end":
    case "customer.subscription.pending_update_applied":
      var subscription = event.data.object;
      let userEmail = subscription.customer_email;

      admin
        .auth()
        .getUserByEmail(userEmail)
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log(`User is already exist: ${JSON.stringify(userRecord)}`);
        })
        .catch(async (error) => {
          await admin
            .auth()
            .createUser({
              email: userEmail,
              emailVerified: true,
              password: "P1o&^AhvTrIkT8QtNZAEx%TF^4FK1Oh72NhRc",
              disabled: false,
            })
            .then((userRecord) => {
              // See the UserRecord reference doc for the contents of userRecord.
              console.log("Successfully created new user:", userRecord.uid);
            })
            .catch((error) => {
              console.log("Error creating new user:", error);
            });
        });

      // update subscription object
      await userRef
        .doc(userEmail)
        .update({
          subscription,
        })
        .then((subscription) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully subscription updated:", subscription);
        })
        .catch((error) => {
          console.log("Error when updating subscription:", error);
        });
      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  return res.status(200).send();
});

api.post("/billing/update/", async (req, res) => {
  const { subscription, plan_id } = req.body;
  const response = await BillingController.UpdateSubscription(
    subscription,
    plan_id
  );
  return res.status(200).send(response);
});

exports.api = functions.https.onRequest(api);

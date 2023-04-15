const stripe = require("stripe")(
  "sk_test_51MjuzlBtjZHWlE9Y6ivWWt3VbP64TVrQrkNeAxgqKRIh5D9Nni6QsezxrdyYW3pfCTzymOlnhIzYNXzuNWqxiG4M00c24NddpI"
);

const LITE_MONTHLY_PLAN_ID = "price_1Mjv8FBtjZHWlE9YyYjH18iF";
const LITE_YEARLY_PLAN_ID = "price_1Mjv8FBtjZHWlE9YgGCcp2Yv";
const PREMIUM_MONTHLY_PLAN_ID = "price_1MkgSJBtjZHWlE9YjdJkZlgK";
const PREMIUM_YEARLY_PLAN_ID = "price_1MkgSJBtjZHWlE9YgJHtEItu";

const CreateStripeCheckout = async (
  email,
  plan,
  frequency,
  client_reference_id
) => {
  let priceId;
  switch (plan) {
    case "lite":
      priceId =
        frequency === "monthly" ? LITE_MONTHLY_PLAN_ID : LITE_YEARLY_PLAN_ID;
      break;
    case "premium":
      priceId =
        frequency === "monthly"
          ? PREMIUM_MONTHLY_PLAN_ID
          : PREMIUM_YEARLY_PLAN_ID;
      break;
    default:
      break;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `https://app.prorouting.ai/checkout/${plan}/success`,
    cancel_url: `https://app.prorouting.ai/checkout/${plan}/false`,
    customer_email: email,
    phone_number_collection: {
      enabled: true,
    },
    client_reference_id,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
  });

  return { ...session };
};

const GetSubscription = (id) => {
  return stripe.subscriptions.retrieve(id);
};

const GenerateStripePortal = async (customer_id) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: "https://app.prorouting.ai/billing",
  });

  return { session };
};

const UpdateSubscription = async (subscription, plan_id) => {
  console.log("subscription", subscription);
  console.log("do upgrade user");
  const sub = await stripe.subscriptions.update(subscription.id, {
    cancel_at_period_end: false,
    items: [
      {
        id: subscription.items.data[0].id,
        price: plan_id,
      },
    ],
  });

  return sub;
};

module.exports = {
  BillingController: {
    CreateStripeCheckout,
    GetSubscription,
    GenerateStripePortal,
    UpdateSubscription,
  },
};

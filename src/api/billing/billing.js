import axios from "axios";
import { BASE_URL } from "../../config/config";

const LITE_MONTHLY = "price_1Mjv8FBtjZHWlE9YyYjH18iF";
const LITE_ANNUALLY = "price_1Mjv8FBtjZHWlE9YgGCcp2Yv";
const PREMIUM_MONTHLY = "price_1MkgSJBtjZHWlE9YjdJkZlgK";
const PREMIUM_ANNUALLY = "price_1MkgSJBtjZHWlE9YgJHtEItu";

export const BillingController = {
  async CreateStripeCheckout(email, plan, frequency, client_reference_id) {
    const response = await axios.post(`${BASE_URL}/billing/checkout`, {
      email,
      plan,
      frequency,
      client_reference_id,
    });

    window._cio.track("create_checkout", {
      id: email,
      plan,
      frequency,
      client_reference_id,
    });

    return response.data;
  },
  async GetSubscription(id) {
    const response = await axios.get(`${BASE_URL}/billing/subscription/${id}`);
    return response.data;
  },

  async ReturnUsersSubscription(subscription) {
    const sub = await this.GetSubscription(subscription?.subscription);
    if (!sub) return { success: false, plan: null };
    if (sub.status === "canceled") return { success: false, plan: null };
    if (sub.status === "incomplete") return { success: false, plan: null };
    if (sub.status === "incomplete_expired")
      return { success: false, plan: null };
    if (sub.status === "past_due") return { success: false, plan: null };
    if (sub.status === "unpaid") return { success: false, plan: null };

    if (sub.plan.id === PREMIUM_MONTHLY || sub.plan.id === PREMIUM_ANNUALLY) {
      return { success: true, plan: "premium" };
    }
    if (sub.plan.id === LITE_MONTHLY || sub.plan.id === LITE_ANNUALLY) {
      return { success: true, plan: "lite" };
    }
  },
  async GenerateStripePortal(customer_id) {
    const response = await axios.get(
      `${BASE_URL}/billing/portal/${customer_id}`
    );
    return response.data;
  },
  async UpdateSubscription(sub_id, plan, mode) {
    let subscription = await this.GetSubscription(sub_id);

    let plan_id;
    if (mode === "monthly") {
      if (plan === "lite") plan_id = LITE_MONTHLY;
      else plan_id = PREMIUM_MONTHLY;
    }
    if (mode === "annually") {
      if (plan === "lite") plan_id = LITE_ANNUALLY;
      else plan_id = PREMIUM_ANNUALLY;
    }

    const response = await axios.post(`${BASE_URL}/billing/update`, {
      subscription,
      plan_id,
    });
    return response.data;
  },
};

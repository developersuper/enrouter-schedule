import axios from "axios";
import { BASE_URL } from "src/config/config";

export const SupportAPI = {
  async GetHelpArticles() {
    const res = await axios.get(`${BASE_URL}/help-desk`);

    return res.data;
  },
};

import axios from "axios";
import {
  REDLINE_API_HOST,
  REDLINE_API_KEY,
  REDLINE_BASE_URL,
} from "src/config/config";

//Map api work
export const MapsAPI = {
  async GetZipCodesInRadius(body) {
    const { location, type, radius } = body;

    let url;
    if (type === "zipcode") {
      url = `https://redline-redline-zipcode.p.rapidapi.com/rest/radius.json/${location.zipcode}/${radius}/mile`;
    } else {
      url = `https://redline-redline-zipcode.p.rapidapi.com/rest/city-zips.json/${location.city}/${location.state}`;
    }

    const headers = {
      "X-RapidAPI-Key": REDLINE_API_KEY,
      "X-RapidAPI-Host": REDLINE_API_HOST,
    };
    const res = await axios.get(url, { headers });

    return res.data;
  },
};

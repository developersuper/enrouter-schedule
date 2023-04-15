const axios = require("axios");

const distanceBetweenZipcodes = async (zipcode1, zipcode2) => {
  console.log("zipcode1", zipcode1);
  console.log("zipcode2", zipcode2);
  const options = {
    method: "GET",
    url: `https://redline-redline-zipcode.p.rapidapi.com/rest/distance.json/${zipcode1}/${zipcode2}/mile`,
    headers: {
      "X-RapidAPI-Key": "f98dcb0ddcmsh946a734fc8b15e3p1e8a1ajsn5a0ea05f6f5c",
      "X-RapidAPI-Host": "redline-redline-zipcode.p.rapidapi.com",
    },
  };

  const res = await axios.request(options);
  console.log("res", res.data);
  return res.data.distance;
};

module.exports = {
  distanceBetweenZipcodes,
};

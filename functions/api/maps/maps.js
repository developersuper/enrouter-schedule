const GetZipCodesInRadius = async (zipCode, radius) => {
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=AIzaSyDMzTIKp8wHo0drotbi0m_BEUqu9arnAZE`;
  const geocodeResponse = await fetch(geocodeUrl);
  const geocodeData = await geocodeResponse.json();
  const { lat, lng } = geocodeData.results[0].geometry.location;

  const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${
    radius * 1609.34
  }&type=postal_code&key=AIzaSyDMzTIKp8wHo0drotbi0m_BEUqu9arnAZE`;
  const placesResponse = await axios.get(placesUrl, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  });
  const placesData = await placesResponse.json();

  const zipCodes = placesData.results.map((result) => result.name);

  return zipCodes;
};

module.exports = {
  MapController: {
    GetZipCodesInRadius,
  },
};

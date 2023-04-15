import axios from "axios";

export const GoogleMapAPI = {
  async GetGeocoder(zipcodes) {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcodes}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const paths = res.data.results.map((item) => {
      const location = item.geometry.location;
      return { lat: location.lat, lng: location.lng };
    });

    return paths;
  },
};

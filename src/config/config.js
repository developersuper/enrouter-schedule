const INITIAL_ACCOUNT_PASSWORD = "P1o&^AhvTrIkT8QtNZAEx%TF^4FK1Oh72NhRc";
const APP_URL = "https://on-my-way-meet.web.app/";
//const BASE_URL = "http://127.0.0.1:5001/on-my-way-meet/us-central1/api";
const BASE_URL = "https://us-central1-on-my-way-meet.cloudfunctions.net/api";

const RAPID_API_APP = "prorouting";
const REDLINE_BASE_URL = "https://redline-redline-zipcode.p.rapidapi.com/rest";
const REDLINE_API_HOST = "redline-redline-zipcode.p.rapidapi.com";
const REDLINE_API_KEY = "8c12f23cb4msh6f61e11d8cd5b2ap1b26c7jsn60a2250d3c13";

const TIMEZONES = [
  {
    label: "Pacific Time - US & Canada",
    timezone: "America/Los_Angeles",
  },
  {
    label: "Mountain Time - US & Canada",
    timezone: "America/Denver",
  },
  {
    label: "Central Time - US & Canada",
    timezone: "America/Chicago",
  },
  {
    label: "Eastern Time - US & Canada",
    timezone: "America/New_York",
  },
];

module.exports = {
  INITIAL_ACCOUNT_PASSWORD,
  APP_URL,
  BASE_URL,
  RAPID_API_APP,
  REDLINE_BASE_URL,
  REDLINE_API_HOST,
  REDLINE_API_KEY,
  TIMEZONES,
};

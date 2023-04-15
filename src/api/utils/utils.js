import { v4 as uuidv4 } from "uuid";

const createUuid = () => {
  return uuidv4();
};

const generateRandomString = (length) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const getTotalDays = (date) => {
  return Math.floor(date.getTime() / (1000 * 3600 * 24));
};

const Dateyyyymmdd = (date) => {
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  return [
    date.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd,
  ].join("/");
};

const timeToNumber = (time) => {
  let [hours, minutes, ampm] = time.split(/[\s:]/);
  hours = parseInt(hours, 10);
  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  }
  if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return hours * 4 + parseInt(minutes, 10) / 15;
};

const numberToTime = (number) => {
  let hours = Math.floor(number / 4);
  let ampm = hours < 12 ? "AM" : "PM";
  let minutes = 15 * (number % 4);
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    " " +
    ampm
  );
};

const emailValidator = (email) => {
  const validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(validRegex);
};
const getDayIdx = (day) => {
  let dayIdx;
  switch (day) {
    case "Sunday":
      dayIdx = 0;
      break;
    case "Monday":
      dayIdx = 1;
      break;
    case "Tuesday":
      dayIdx = 2;
      break;
    case "Wednesday":
      dayIdx = 3;
      break;
    case "Thursday":
      dayIdx = 4;
      break;
    case "Friday":
      dayIdx = 5;
      break;
    case "Saturday":
      dayIdx = 6;
      break;
    default:
      return null;
  }
  return dayIdx;
};

export default {
  generateRandomString,
  createUuid,
  getTotalDays,
  Dateyyyymmdd,
  timeToNumber,
  numberToTime,
  emailValidator,
  getDayIdx,
};

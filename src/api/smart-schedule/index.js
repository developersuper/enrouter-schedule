const { distanceBetweenZipcodes } = require("./distance");
import utils from "../utils/utils";

const distanceCache = {};
const interval = 15; //each interval is 15mins

const getDistance = async (z1, z2) => {
  if (z1 !== z2) {
    let distance;
    if (distanceCache[`${z1}:${z2}`]) {
      return distanceCache[`${z1}:${z2}`];
    } else if (distanceCache[`${z2}:${z1}`]) {
      return distanceCache[`${z2}:${z1}`];
    } else {
      distance = await distanceBetweenZipcodes(z1, z2);
      distanceCache[`${z1}:${z2}`] = distance;
      return distance;
    }
  }
};

const getDrivingTime = (distance) => {
  console.log("distance", distance / 15);
  return Math.ceil(distance / 15);
};

const smartScheduling = async (data) => {
  const {
    appointments,
    newAppointmentZipcode,
    maximumDistanceBetweenAppointments,
    workingTime,
    minimumBufferTime,
    lengthOfAppointment,
    date,
  } = data;

  console.log(data);

  const { numberToTime } = utils;
  const buffer = minimumBufferTime / interval;
  const length = lengthOfAppointment / interval;
  const start = workingTime.from;
  const end = workingTime.to;

  // get appointments and sort them in order of start time.
  const appointmentsAtDay = appointments
    .map((ap) => {
      return {
        ...ap,
        duration: parseInt(ap.duration.value, 10) / interval,
      };
    })
    .sort((a, b) => (a.start === b.start ? 0 : a.start < b.start ? -1 : 1));
  console.log(
    appointments,
    "at smart scheduling: appointments: ",
    appointmentsAtDay
  );

  let availableIntervals = [];
  if (appointmentsAtDay.length === 0) {
    //if there isn't any appointments at current day, set meeting at first time

    let early = start + buffer;
    let last = end - length;
    if (last >= early) availableIntervals.push({ start: early, end: last });
  } else {
    //get each available intervals between meetings and evaluate if new meeting is available in that time interval
    for (let j = 0; j < appointmentsAtDay.length; j++) {
      const nxt = appointmentsAtDay[j];
      // evaluate between start working time and first appointment time
      if (j === 0) {
        // available early meeting start time
        let early = start + buffer;
        // calculate distance with first appointment
        const distance = await getDistance(newAppointmentZipcode, nxt.zipcode);
        // calculate latest meeting start time
        let last = nxt.end - getDrivingTime(distance);
        if (maximumDistanceBetweenAppointments >= distance) {
          last -= length;
        } else {
          last -= 2 * length;
        }
        //check if available before next meeting time
        if (last >= early) {
          availableIntervals.push({ start: early, end: last });
        }
      }

      //evaluate between meetings
      if (j >= 1 && j < appointmentsAtDay.length) {
        const pre = appointmentsAtDay[j - 1];
        // calculate earliest start time
        const distance1 = await getDistance(newAppointmentZipcode, pre.zipcode);
        let early = pre.end + getDrivingTime(distance1) + buffer;
        // calc lastest meeting start time
        const distance2 = await getDistance(newAppointmentZipcode, nxt.zipcode);
        let last = nxt.start - getDrivingTime(distance2);
        if (
          maximumDistanceBetweenAppointments >= distance1 &&
          maximumDistanceBetweenAppointments >= distance2
        ) {
          last -= length;
        } else {
          last -= 2 * length;
        }
        if (last >= early) {
          availableIntervals.push({ start: early, end: last });
        }
      }
      // evaluate after last meeting
      if (j === appointmentsAtDay.length - 1) {
        // calculate distance between last meeting position and new meeting position
        const distance = await getDistance(newAppointmentZipcode, nxt.zipcode);
        console.log(distance);
        let early = nxt.end + buffer + getDrivingTime(distance);
        let last = end;
        if (distance <= maximumDistanceBetweenAppointments) {
          last -= length;
        } else {
          last -= 2 * length;
        }
        if (last >= early) {
          availableIntervals.push({ start: early, end: last });
        }
      }
    }
  }

  let availableTimes = [];
  availableIntervals.forEach((avI) => {
    for (let k = avI.start; k <= avI.end; k++)
      availableTimes.push(numberToTime(k));
  });

  console.log(availableIntervals, availableTimes);

  return availableTimes;
};

export default {
  smartScheduling,
};

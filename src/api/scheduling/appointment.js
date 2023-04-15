import {
  addDoc,
  collection,
  db,
  doc,
  query,
  getDocs,
  where,
  updateDoc,
  auth,
} from "boot/firebase";
import axios from "axios";
import utils from "../utils/utils";

import { UserAuthenticationAPI } from "../auth/auth";

export const AppointmentAPI = {
  CreateAppointment: async (appointment) => {
    try {
      console.log(appointment);
      const { uid, email } = auth;
      appointment.appointmentName = appointment.name;
      //conflicts with which email we want to message
      appointment.appointmentEmail = appointment.email;

      //  Add the area data to the "areas" collection
      const appointmentsRef = collection(db, "appointments");
      await addDoc(appointmentsRef, {
        ...appointment,
      });

      window._cio.track("create_appointment", {
        id: uid,
        appointment,
      });

      await Promise.all([
        //send to person booking
        UserAuthenticationAPI.SendEmail(
          appointment.appointmentEmail,
          appointment.name,
          appointment.email,
          "appointment_created",
          appointment
        ),
        //send to client
        UserAuthenticationAPI.SendEmail(
          email,
          null,
          uid,
          "appointment_created",
          appointment
        ),
      ]);

      return {
        success: true,
        message: "Appointment created successfully!",
      };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return {
        success: false,
        message: "Error creating appointment",
      };
    }
  },
  GetAppointments: async (uid) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      return {
        success: true,
        message: "Appointment retrieved successfully!",
        appointments,
      };
    } catch (error) {
      console.error("Error retrieving appointments:", error);
      return {
        success: false,
        message: "Error retrieving appointments",
      };
    }
  },
  GetAppointmentsByUidAndDate: async (uid, date) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("uid", "==", uid),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      const intervals = appointments.map((ap) => {
        const start = utils.timeToNumber(ap.startTime);
        const end = start + parseInt(ap.duration.value) / 15;
        return { start, end };
      });
      return {
        success: true,
        intervals,
      };
    } catch (error) {
      console.error("Error retrieving appointments:", error);
      return {
        success: false,
        intervals: [],
      };
    }
  },
  UpdateAppointmentStartTimeById: async (startTime, id) => {
    try {
      const docRef = doc(db, "appointments", id);
      const res = await updateDoc(docRef, { startTime });
      return { success: true, res };
    } catch (error) {
      console.error("Error retrieving appointments:", error);
      return {
        success: false,
      };
    }
  },
  SendWebhook: async (appointment, url) => {
    try {
      await axios.post(url, { ...appointment });
      return {
        success: true,
        message: "Appointment sent successfully!",
      };
    } catch (error) {
      console.error("Error sending appointment:", error);
      return {
        success: false,
        message: "Error sending appointment",
      };
    }
  },
};

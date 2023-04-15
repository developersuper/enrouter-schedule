import {
  addDoc,
  collection,
  db,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "boot/firebase";
import axios from "axios";
import { BASE_URL } from "src/config/config";

export const SchedulingAPI = {
  InitSchedule: async (schedule) => {
    //come up with random generated username of just letters thats 10 characters, verify that no one else has this username
    //if they do, generate a new one
    //if they don't, create the user and then create the schedule

    //generate random username
    const randomUsername = () => {
      let result = "";
      const characters = "abcdefghijklmnopqrstuvwxyz";
      const charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result.toLowerCase();
    };

    //check if username exists
    const checkUsername = async (username) => {
      const schedulesRef = collection(db, "schedules");
      const q = query(schedulesRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return false;
      } else {
        return true;
      }
    };

    //generate random username and check if it exists

    let username = randomUsername();
    let usernameExists = await checkUsername(username);
    while (usernameExists) {
      username = randomUsername();
      usernameExists = await checkUsername(username);
    }

    schedule.username = username;

    await axios.post(`${BASE_URL}/reserve-link`, {
      username,
    });

    try {
      // Add the schedule data to the "schedules" collection
      const schedulesRef = collection(db, "schedules");
      //add doc with id
      const scheduleRef = await addDoc(schedulesRef, schedule);
      //update the schedule with the id
      await updateDoc(doc(db, "schedules", scheduleRef.id), {
        id: scheduleRef.id,
      });

      window._cio.track("create_schedule", {
        id: schedule.uid,
        schedule_id: schedulesRef.id,
      });

      return {
        success: true,
        id: schedule.id,
        data: schedule,
        message: "Schedule initialized successfully!",
      };
    } catch (error) {
      console.error("Error initializing schedule:", error);
      return {
        data: {},
      };
    }
  },
  GetScheduleByUsername: async (username) => {
    try {
      // Get the schedule data from the "schedules" collection
      const schedulesRef = collection(db, "schedules");
      const q = query(schedulesRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      //check existing
      if (querySnapshot.empty) {
        return {
          success: false,
          message: "No schedule exists",
        };
      } else {
        //return the schedule
        const id = querySnapshot.docs[0].id;
        return {
          success: true,
          schedule: {
            ...querySnapshot.docs[0].data(),
            id,
          },
        };
      }
    } catch (error) {
      console.error("Error getting schedule:", error);
      return {
        success: false,
        schedule: null,
        message: "Error getting schedule",
      };
    }
  },
  GetSchedule: async (uid) => {
    try {
      // Get the schedule data from the "schedules" collection
      const schedulesRef = collection(db, "schedules");
      const q = query(schedulesRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      //does it exist?
      if (querySnapshot.empty) {
        return {
          success: false,
          schedule: null,
          message: "No schedule exists",
        };
      } else {
        //return the schedule
        const id = querySnapshot.docs[0].id;
        return {
          success: true,
          schedule: {
            ...querySnapshot.docs[0].data(),
            id,
          },
        };
      }
    } catch (error) {
      console.error("Error getting schedule:", error);
      return {
        success: false,
        schedule: null,
        message: "Error getting schedule",
      };
    }
  },
  UpdateSchedule: async (schedule) => {
    try {
      const id = schedule.id;
      // Update the schedule data in the "schedules" collection
      const scheduleRef = doc(db, "schedules", id);
      await updateDoc(scheduleRef, schedule);

      window._cio.track("update_schedule", {
        id: schedule.uid,
        schedule_id: id,
      });

      return {
        success: true,
        data: schedule,
        message: "Schedule updated successfully!",
      };
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
      // return {
      //   success: false,
      //   data: schedule,
      //   message: "Error updating schedule",
      // };
    }
  },
  //TODO REWRITE
  sendWebhook: async (webhook) => {
    try {
      // Get the schedule data from the "schedules" collection
      const schedulesRef = collection(db, "schedules");
      // const q = query(schedulesRef, where("username", "==", username));
      const q = query(schedulesRef);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: false,
          schedule: null,
          message: "No schedule exists",
        };
      } else {
        const schedulesArray = [];
        for (let i = 0; i < querySnapshot.docs.length; i++) {
          if (webhook.userId == querySnapshot.docs[i].data().uid) {
            var schedule = querySnapshot.docs[i].data();
            schedule.webhookUrl = webhook.webhookUrl;

            const id = schedule.id;
            const schedulesRef = doc(db, "schedules", id);
            await updateDoc(schedulesRef, schedule);
            schedulesArray.push(schedule);
          }
        }
        return schedulesArray;
      }
    } catch (error) {
      console.log("error", error);
    }
  },
  saveWebhook: async (scheduleId, webhook) => {
    const scheduleRef = doc(db, "schedules", scheduleId);
    await updateDoc(scheduleRef, { webhookUrl: webhook });
    return {
      success: true,
    };
  },
  createRebrandlyLink: async (username) => {
    await axios.post(BASE_URL + "/reserve-link", {
      username,
    });
  },
  SaveUsername: async (username, id) => {
    try {
      //validate username has only hyphens or underscores. no spaces. just letters numbers hyphen underscore and periods
      const re = /^[a-zA-Z0-9_.-]*$/;
      if (!re.test(username)) {
        return {
          success: false,
          message:
            "Username can only contain letters, numbers, hyphens, underscores, and periods",
        };
      }

      const schedules = collection(db, "schedules");
      const q = query(schedules, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        try {
          await SchedulingAPI.createRebrandlyLink(username);
        } catch (error) {
          console.log("error", error);
        }

        const schedulesRef = doc(db, "schedules", id);
        username = username.toLowerCase();
        await updateDoc(schedulesRef, { username });

        return {
          success: true,
          message: "Username updated successfully!",
        };
      } else {
        return {
          success: false,
          message: "Username already exists!",
        };
      }
    } catch (error) {
      console.log("Error saving username:", error);
      return {
        success: false,
        message: "Error updating schedule",
      };
    }
  },
};

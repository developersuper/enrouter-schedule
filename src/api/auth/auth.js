import {
  signInWithEmailAndPassword,
  auth,
  db,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "boot/firebase";
import axios from "axios";

import { BASE_URL } from "src/config/config";

export const UserAuthenticationAPI = {
  async SignInWithEmailAndPassword(email, password) {
    let message;
    let success;

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (creds) => {
        const userRef = doc(db, "users", creds.user.uid);
        const getUser = await getDoc(userRef);
        const { email, user } = getUser.data();
        window._cio.track("logged_in", { ...getUser.data() });
        success = true;
      })
      .catch((error) => {
        success = false;
        switch (error.code) {
          case "auth/user-not-found":
            message = "User not found";
            break;
          case "auth/wrong-password":
            message = "Wrong password";
            break;
          case "auth/network-request-failed":
            message = "Poor connection";
          default:
            console.log(error.code);
            break;
        }
        return false;
      });

    return { success, message };
  },

  async VerifyEmail(email) {
    try {
      await axios.post(`${BASE_URL}/verify`, { email });
      const user = auth.currentUser;
      await this.SendEmail(email, null, user.uid, "welcome_email");
      return {
        success: true,
      };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async CreateUser(user) {
    try {
      let success = false;
      let message = "";

      await createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(async (_doc) => {
          const _user = _doc.user;
          const userRef = doc(db, "users", _user.uid);

          await setDoc(userRef, {
            email: user.email,
            first_name: user?.fname || "",
            uid: _user.uid,
          });

          await Promise.all([
            window._cio.identify({
              id: _user.uid,
              email: this.email,
              name: this.name,
            }),

            window._cio.track("registered", {
              id: _user.uid,
              email: user.email,
              first_name: user?.fname || "",
              uid: _user.uid,
            }),
          ]);

          const res = await this.SendEmail(
            user.email,
            user.fname,
            _user.uid,
            "create_account"
          );

          return {
            success: res.success,
            message: _user.uid,
          };
        })
        .catch((error) => {
          console.log("error", error);
          success = false;
          switch (error.code) {
            case "auth/email-already-in-use":
              message = "Email already in use";
              break;
            default:
              message = error;
              break;
          }
        });
      return {
        success,
        message,
      };
    } catch (e) {
      console.error(e);
      return { success: false, message: e };
    }
  },

  async SendEmail(email, first_name = null, uid = null, type, details = {}) {
    try {
      await axios.post(`${BASE_URL}/email/send`, {
        type,
        user: {
          email,
          first_name,
          uid,
          id: uid,
        },
        data: {
          ...details,
        },
      });
      return {
        success: true,
      };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async GetUser(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const getUser = await getDoc(userRef);
      const user = getUser.data();
      return {
        success: true,
        user: {
          ...user,
        },
      };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async RequestBeta(feature, uid) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        beta: {
          [feature]: true,
        },
      });
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async UpdateUser(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...user,
      });
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  ClearLocalStorage() {
    try {
    } catch (e) {
      console.error(e);
    } finally {
    }
  },

  async SendPasswordResetEmail(email) {
    let message;
    let success;

    await sendPasswordResetEmail(auth, email)
      .then(async (creds) => {
        success = true;
      })
      .catch((error) => {
        console.log(error.code);
        success = false;
        switch (error.code) {
          case "auth/user-not-found":
            message = "User not found";
            break;
          case "auth/wrong-password":
            message = "Wrong password";
            break;
          case "auth/network-request-failed":
            message = "Poor connection";
          default:
            console.log(error.code);
            break;
        }
        return false;
      });

    return { success, message };
  },

  async ConfirmPasswordReset(email, code, newPassword) {
    let message;
    let success;

    await confirmPasswordReset(auth, email, code, newPassword)
      .then(async (creds) => {
        success = true;
      })
      .catch((error) => {
        success = false;
        switch (error.code) {
          case "auth/user-not-found":
            message = "User not found";
            break;
          case "auth/wrong-password":
            message = "Wrong password";
            break;
          case "auth/network-request-failed":
            message = "Poor connection";
          case "auth/invalid-action-code":
            message = "Invalid Code";
          default:
            console.log(error.code);
            break;
        }
        return false;
      });

    return { success, message };
  },
};

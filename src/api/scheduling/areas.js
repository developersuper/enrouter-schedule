import {
  addDoc,
  collection,
  db,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "boot/firebase";

export const AreasAPI = {
  CreateArea: async (name, locations, uid, existing_id) => {
    try {
      if (existing_id) {
        //find and update this document
        const areasRef = doc(db, "areas", existing_id);
        await updateDoc(areasRef, {
          name,
          locations,
          uid,
        });
        window._cio.track("update_area", {
          id: uid,
          name,
          locations,
        });
        return {
          success: true,
          message: "Area updated successfully!",
        };
      }
      //  Add the area data to the "areas" collection
      const areasRef = collection(db, "areas");
      await addDoc(areasRef, {
        name,
        locations,
        uid,
      });

      window._cio.track("create_area", {
        id: uid,
        name,
        locations,
      });

      return {
        success: true,
        message: "Area created successfully!",
      };
    } catch (error) {
      console.error("Error creating area:", error);
      return {
        success: false,
        message: "Error creating area",
      };
    }
  },
  GetUserAreas: async (uid) => {
    try {
      const areasRef = collection(db, "areas");
      const q = query(areasRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const areas = [];
      querySnapshot.forEach((doc) => {
        areas.push({ id: doc.id, ...doc.data() });
      });
      return {
        success: true,
        message: "Areas retrieved successfully!",
        areas,
      };
    } catch (error) {
      console.error("Error retrieving areas:", error);
      return {
        success: false,
        message: "Error retrieving areas",
      };
    }
  },
  DeleteArea: async (id) => {
    try {
      const areasRef = doc(db, "areas", id);
      await deleteDoc(areasRef);
      return {
        success: true,
        message: "Area deleted successfully!",
      };
    } catch (error) {
      console.error("Error deleting area:", error);
      return {
        success: false,
        message: "Error deleting area",
      };
    }
  },
};

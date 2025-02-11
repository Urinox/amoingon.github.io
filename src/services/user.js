import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  //   limit,
  //   onSnapshot,
  //   query,
  //   where,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { COLLECTION_NAMES } from "../firebase/collection";
import { db } from "../firebase";

const signUpForm = async (id, data) => {
  try {
    const userDoc = doc(db, COLLECTION_NAMES.USERS, id);
    await setDoc(userDoc, {
      id: id,
      fullname: data.fullname,
      email: data.email,
      birthplace: data.birthplace,
      birthdate: data.birthdate,
      startDateOfResidency: data.startDateOfResidency,
      createdAt: new Date().getTime(),
      status: "active",
    });
  } catch (error) {
    console.log("signUpForm error: ", error);
  }
};

const getUserData = async (userId) => {
  try {
    const userDoc = doc(db, COLLECTION_NAMES.USERS, userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.log("getUserData error: ", error);
  }
};

const getAllUsers = async () => {
  try {
    const usersRef = collection(db, COLLECTION_NAMES.USERS);
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => doc.data());
    return users;
  } catch (error) {
    console.log("getAllUsers error: ", error);
  }
};

export { signUpForm, getUserData, getAllUsers };

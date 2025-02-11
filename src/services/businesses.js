import {
  collection,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { COLLECTION_NAMES } from "../firebase/collection";
import { db } from "../firebase";

const addNewBusiness = async (data) => {
  try {
    const businessesCol = collection(db, COLLECTION_NAMES.BUSINESSES);
    const docRef = await addDoc(businessesCol, {
      businessName: data.businessName,
      businessOwner: data.businessOwner,
      location: data.location,
      businessDescription: data.businessDescription,
      contactNumber: data.contactNumber,
      email: data.email,
      link: data.link,
      ownerAddress: data.ownerAddress,
      coordinates: data.coordinates,
      createdAt: new Date().getTime(),
      status: "active",
    });
    await updateDoc(docRef, { id: docRef.id });
  } catch (error) {
    console.log("addNewBusiness error: ", error);
  }
};

const getAllBusinesses = async () => {
  try {
    const businessesRef = collection(db, COLLECTION_NAMES.BUSINESSES);
    const querySnapshot = await getDocs(businessesRef);
    const businesses = querySnapshot.docs.map((doc) => doc.data());
    return businesses;
  } catch (error) {
    console.log("getAllBusinesses error: ", error);
  }
};

const deleteBusiness = async (id) => {
  try {
    const businessRef = doc(db, COLLECTION_NAMES.BUSINESSES, id);
    await deleteDoc(businessRef);
  } catch (error) {
    console.log("deleteBusiness error: ", error);
  }
};

export { addNewBusiness, getAllBusinesses, deleteBusiness };

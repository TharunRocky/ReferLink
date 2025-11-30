import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { doc, deleteDoc} from "firebase/firestore";
import {
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";


export async function postJobOpening(jobData){
    await addDoc(collection(db,"jobOpenings"),jobData);
}

export async function postJobRequest(jobData){
    await addDoc(collection(db,"jobRequests"),jobData);
}

export async function postMessage(messageData){
    await addDoc(collection(db,"messages"),messageData);
}

export async function deleteJobOpening(jobId){
    try {
        await deleteDoc(doc(db, "jobOpenings",jobId));
        console.log("Job Opening deleted successfully");
    }
    catch (error){
        console.error("Error deleting job",error);
        return "error";
    }
    return "success";
    
}

export async function deleteJobRequest(jobId){
    try {
        await deleteDoc(doc(db, "jobRequests",jobId));
        console.log("Job Requests deleted successfully");
    }
    catch (error){
        console.error("Error deleting job",error);
        return "error";
    }
    return "success";
}

export async function DeleteChatsRange(startDate, endDate){
    const start = Timestamp.fromDate(new Date(startDate));
    const end = Timestamp.fromDate(new Date(endDate));
    try {
        const chatsRef = collection(db, "messages");
        const q = query(
        chatsRef,
        where("timestamp", ">=", start),
        where("timestamp", "<=", end)
        );

        const snapshot = await getDocs(q);

        const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return { success: true, count: snapshot.size };
    } catch (error) {
        console.error("Error deleting chats:", error);
        return { success: false, error };
    }
}
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { doc, deleteDoc} from "firebase/firestore";


export async function postJobOpening(jobData){
    await addDoc(collection(db,"jobOpenings"),jobData);
}

export async function postJobRequest(jobData){
    await addDoc(collection(db,"jobRequests"),jobData);
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
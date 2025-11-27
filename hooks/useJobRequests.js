import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import {db} from "@/lib/firebase/firebase";


export default function useJobRequests() {
    const [jobRequest, setJobRequests] = useState([]);


    useEffect(()=>{
        const q =query(
            collection(db, "jobRequests"),orderBy("createdAt","desc")
        );
        
    const unsubscribe = onSnapshot(q,(snapshot)=>{
        
        let hasUpdates =false;
        const addedJobs =[];
        const removeIds = new Set();
        snapshot.docChanges().forEach(change => {
            
            if(change.type === "added"){
                addedJobs.push({ _id:change.doc.id, ...change.doc.data() });
                hasUpdates=true;
            }
            else if( change.type === "removed"){
                removeIds.add(change.doc.id);
                hasUpdates=true;
            }
        });
        if(hasUpdates){
            setJobRequests(prev => {
                const filteredPrev = prev.filter(job => !removeIds.has(job._id));
                const exisitingIds = new Set(filteredPrev.map(job => job._id));
                const uniqueAdded = addedJobs.filter(job => !exisitingIds.has(job._id));
                return [...uniqueAdded, ...filteredPrev];
            });
        }
    },(error) =>{
        console.warn("Firestore offline expected: ",error.message);
    });
    return () =>{
        unsubscribe();
    }
    },[]);
    return jobRequest;
}
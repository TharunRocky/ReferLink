import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot  } from "firebase/firestore";
import {db} from "@/lib/firebase/firebase";


export default function useJobsOpenings() {
    const [jobOpening, setJobOpenings] = useState([]);

    useEffect(()=>{

        const q =query(
            collection(db, "jobOpenings"),orderBy("createdAt","desc")
        );
        
    const unsubscribe = onSnapshot(q,(snapshot)=>{
        console.log("Listener started for JobOpening");
        const data=snapshot.docChanges();
        let hasUpdates =false;
        const addedJobs =[];
        const removeIds = new Set();
        data.forEach(change => {
            
            if(change.type === "added"){
                addedJobs.push({ _id: change.doc.id,...change.doc.data() });
                hasUpdates=true;
            }
            else if( change.type === "removed"){
                console.log("Remvoed event");
                removeIds.add(change.doc.id);
                hasUpdates=true;
            }
        });
        if(hasUpdates){
            setJobOpenings(prev => {
                const filteredPrev = prev.filter(job => !removeIds.has(job._id));
                const exisitingIds = new Set(filteredPrev.map(job => job._id));
                const uniqueAdded = addedJobs.filter(job => !exisitingIds.has(job._id));
                return [...uniqueAdded, ...filteredPrev];
            });
        }
    }, (error) =>{
        console.warn("Firestore offline expected: ",error.message);
    });
    return () =>{
        console.log("Listener removed");
        unsubscribe();
    }
    },[]);
    return jobOpening;
}
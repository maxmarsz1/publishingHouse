import { Publisher, Raport, Status } from "../types/types";
import { getPublisherData } from "./publisher-helper";

export function getRaportsToReview(publisher?: Publisher): Raport[]{
    // mocking data fetching from backend
    if(publisher === undefined){
        publisher = getPublisherData(0);
    }

    const raports: Raport[] = [
      {
        id: 1,
        title: "Raport 1",
        status: Status.Pending,
        grade: 0,
        publisher: publisher
      },
      {
        id: 2,
        title: "Raport 2",
        status: Status.Published,
        grade: 5,
        publisher: publisher
      },
      {
        id: 3,
        title: "Raport 3",
        status: Status.Rejected,
        grade: 0,
        publisher: publisher
      }
    ]
    return raports;
  }
  
  export function getUserRaports(publisher?: Publisher): Raport[]{
    // mocking data fetching from backend
    
    return getRaportsToReview();
  }
import React from "react";
import { Publisher, User } from "@/app/types/types";
import styles from "./AdminActions.module.css";
import JoinCode from "./JoinCode";
import DistributeReviewsBtn from "./DistributeReviewsBtn";
import AcceptAllReviewsBtn from "./AcceptAllReviewsBtn";
import ManageBtn from "./ManageBtn";

const AdminActions = ({
  publisher,
  onDueDateUpdate,
  members,
  setMembers,
}: {
  publisher: Publisher;
  onDueDateUpdate: (newDueDate: string) => void;
  members: User[] | null;
  setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <ManageBtn
          publisher={publisher}
          onDueDateUpdate={onDueDateUpdate}
          members={members}
          setMembers={setMembers}
        />
        <DistributeReviewsBtn publisherId={publisher.id} />
        <AcceptAllReviewsBtn publisherId={publisher.id} />
      </div>
      <JoinCode publisher={publisher} />
    </div>
  );
};

export default AdminActions;

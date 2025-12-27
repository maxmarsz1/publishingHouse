import React from "react";
import { Magazine, User } from "@/app/types/types";
import styles from "./AdminActions.module.css";
import JoinCode from "./JoinCode";
import DistributeReviewsBtn from "./DistributeReviewsBtn";
import AcceptAllReviewsBtn from "./AcceptAllReviewsBtn";
import ManageBtn from "./ManageBtn";

const AdminActions = ({
  magazine,
  onDueDateUpdate,
  members,
  setMembers,
}: {
  magazine: Magazine;
  onDueDateUpdate: (newDueDate: string) => void;
  members: User[] | null;
  setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <ManageBtn
          magazine={magazine}
          onDueDateUpdate={onDueDateUpdate}
          members={members}
          setMembers={setMembers}
        />
        <DistributeReviewsBtn magazineId={magazine.id} />
        <AcceptAllReviewsBtn magazineId={magazine.id} />
      </div>
      <JoinCode magazine={magazine} />
    </div>
  );
};

export default AdminActions;

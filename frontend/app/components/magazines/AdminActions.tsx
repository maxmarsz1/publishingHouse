import React from "react";
import NewDueDateBtn from "./NewDueDateBtn";
import DeleteMagazineBtn from "./DeleteMagazineBtn";
import { Publisher, User } from "@/app/types/types";
import styles from "./AdminActions.module.css";
import JoinCode from "./JoinCode";
import MembersBtn from "./MembersBtn";

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
        <NewDueDateBtn publisher={publisher} onDueDateUpdate={onDueDateUpdate} />
        <MembersBtn
          publisher={publisher}
          members={members}
          setMembers={setMembers}
        />
        {publisher.id && <DeleteMagazineBtn publisherId={publisher.id} />}
      </div>
      <JoinCode publisher={publisher} />
    </div>
  );
};

export default AdminActions;

import React from "react";
import NewDueDateBtn from "./NewDueDateBtn";
import DeletePublisherBtn from "./DeletePublisherBtn";
import { Publisher } from "@/app/types/types";
import styles from "./AdminActions.module.css";
import JoinCode from "./JoinCode";
import MembersBtn from "./MembersBtn";

const AdminActions = ({
  publisher,
  onDueDateUpdate,
}: {
  publisher: Publisher;
  onDueDateUpdate: (newDueDate: string) => void;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <NewDueDateBtn publisher={publisher} onDueDateUpdate={onDueDateUpdate} />
        <MembersBtn publisher={publisher} />
        {publisher.id && <DeletePublisherBtn publisherId={publisher.id} />}
      </div>
      <JoinCode publisher={publisher} />
    </div>
  );
};

export default AdminActions;

import React, { useState } from "react";
import { Publisher, User } from "@/app/types/types";
import styles from "./Modal.module.css";
import Backdrop from "../general/Backdrop";
import { Button } from "@mui/material";
import { deletePublisherMember } from "@/app/utils/publisher-helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ConfirmationDialog from "../general/ConfirmationDialog";

const MembersModal = ({
  publisher,
  setShowModal,
  members,
  setMembers,
}: {
  publisher: Publisher;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  members: User[] | null;
  setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
  const [error, setError] = useState("");
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  function cancel() {
    setShowModal(false);
  }

  function handleDeleteClick(user_id: number) {
    setMemberToDelete(user_id);
    setShowConfirm(true);
  }

  async function handleConfirmDelete() {
    if (!publisher.id || !memberToDelete) return;

    try {
      await deletePublisherMember(publisher.id, memberToDelete);
      setMembers((prevMembers) =>
        prevMembers ? prevMembers.filter((member) => member.id !== memberToDelete) : null
      );
    } catch (error) {
      console.error("Error deleting publisher member:", error);
      setError("Błąd podczas usuwania członka wydawnictwa");
    } finally {
      setShowConfirm(false);
      setMemberToDelete(null);
    }
  }

  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Członkowie wydawnictwa</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <div className={styles.memberList}>
            <div className={styles.memberListHeader}>Imię i nazwisko</div>
            <div className={styles.memberListHeader}>Akcje</div>
            {members && members.map((member: User) => (
              <React.Fragment key={member.id}>
                <div className={styles.memberFullname} title={member.email}>{member.first_name} {member.last_name}</div>
                <div className={styles.memberActions}>
                  <FontAwesomeIcon
                    icon={faClose}
                    className={styles.closeBtn}
                    onClick={() => handleDeleteClick(member.id)}
                  />
                </div>
              </React.Fragment>
            ))}
            {(!members || members.length === 0) && <li>Brak członków w wydawnictwie.</li>}
          </div>
        </div>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Zamknij
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={showConfirm}
        title="Jesteś pewien?"
        message="Czy na pewno chcesz usunąć tego użytkownika z wydawnictwa?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default MembersModal;

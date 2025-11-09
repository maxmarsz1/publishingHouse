"use client";

import { Publisher, User } from "@/app/types/types";
import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import Backdrop from "../general/Backdrop";
import { Button } from "@mui/material";
import { getPublisherMembers } from "@/app/utils/publisher-helper-client";

const MembersModal = ({
  publisher,
  setShowModal,
}: {
  publisher: Publisher;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [members, setMembers] = useState<User[]>([]);
  const [error, setError] = useState("");

  function cancel() {
    setShowModal(false);
  }

  useEffect(() => {
    async function fetchMembers() {
      if (!publisher.id) {
        console.log("Brak id wydawnictwa");
        return;
      }
      try {
        const fetchedMembers = await getPublisherMembers(publisher.id);
        setMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching publisher members:", error);
        setError("Błąd podczas pobierania członków wydawnictwa");
      }
    }

    fetchMembers();
  }, [publisher.id]);

  return (
    <>
      <Backdrop />
      <div className={styles.modal}>
        <h2>Członkowie wydawnictwa</h2>
        {error && <p className={styles.error}>{error}</p>}
        <div>
          <ul>
              {members.map((member) => (
                <li key={member.id}>
                  {member.first_name} {member.last_name} ({member.email})
                </li>
              ))}
              {members.length === 0 && <li>Brak członków w wydawnictwie.</li>}
          </ul>
        </div>
        <div className={styles.buttons}>
          <Button variant="outlined" onClick={cancel}>
            Zamknij
          </Button>
        </div>
      </div>
    </>
  );
};

export default MembersModal;

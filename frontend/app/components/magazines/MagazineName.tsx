import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import styles from "./MagazineName.module.css";
import { updatePublisher } from "@/app/utils/publisher-helper-client";
import { UserContext } from "@/app/context/UserContext";

const MagazineName = ({
  publisherId,
  publisherName,
}: {
  publisherId: number;
  publisherName: string;
}) => {
  const { isStaff } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(publisherName);
  const [nameInput, setNameInput] = useState(publisherName);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
  };

  const handleSave = () => {
    if (!nameInput.trim()) {
      console.log("Nazwa jest wymagana");
      return;
    }
    try {
      updatePublisher({ id: publisherId, name: nameInput });
      setIsEditing(false);
      setName(nameInput);
      console.log("Updated name:", name);
    } catch (error) {
      console.error("Error updating publisher name:", error);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setNameInput(name);
  };

  if (!isStaff) {
    return (
      <div className={styles.nameContainer}>
        <h1>{name}</h1>
      </div>
    );
  }

  return (
    <div className={styles.nameContainer}>
      {isEditing ? (
        <>
          <TextField
            value={nameInput}
            onChange={handleNameChange}
            variant="standard"
            autoFocus
            className={styles.input}
          />
          <div className={styles.buttonContainer}>
            <Button variant="contained" onClick={handleSave} color="primary">
              Zapisz
            </Button>
            <Button variant="outlined" color="error" onClick={toggleEditing}>
              Anuluj
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "0" }}>{name}</h1>
          <FontAwesomeIcon
            icon={faPencilAlt}
            style={{ cursor: "pointer" }}
            onClick={toggleEditing}
          />
        </>
      )}
    </div>
  );
};

export default MagazineName;

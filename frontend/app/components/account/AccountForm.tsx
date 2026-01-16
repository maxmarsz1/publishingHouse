"use client";

import { User } from "@/app/types/types";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import styles from "./AccountForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateAccountData, updatePassword } from "@/app/utils/account-helper";
import { useUI } from "@/app/context/UIContext";

interface Props {
  userData: User;
}

const AccountForm = ({ userData }: Props) => {
  const { showSnackbar } = useUI();
  const [firstName, setFirstName] = useState(userData.first_name);
  const [lastName, setLastName] = useState(userData.last_name);
  const [email, setEmail] = useState(userData.email);
  const [oldpassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [editing, setEditing] = useState(false);

  const [savedData, setSavedData] = useState({
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email,
  });

  async function handleSave() {
    if (!firstName || !lastName || !email) {
      console.log("Wypełnij wszystkie pola");
      showSnackbar("Wypełnij wszystkie pola", "error");
      return;
    }

    try {
      const response = await updateAccountData({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      console.log("Account data updated successfully:", response);
      showSnackbar("Dane konta zostały zaktualizowane", "success");

      setSavedData({
        firstName,
        lastName,
        email,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating account data:", error);
    }
  }

  async function handleNewPassword() {
    if (!oldpassword || !password || !password1) {
      console.log("Wypełnij wszystkie pola dotyczące hasła");
      showSnackbar("Wypełnij wszystkie pola dotyczące hasła", "error");
      return;
    }
    if (password !== password1) {
      console.log("Nowe hasła nie są identyczne");
      showSnackbar("Nowe hasła nie są identyczne", "error");
      return;
    }

    try {
      await updatePassword(oldpassword, password);
      console.log("Password updated successfully");
      showSnackbar("Hasło zostało zmienione pomyślnie", "success");
      setOldPassword("");
      setPassword("");
      setPassword1("");
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }

  function handleCancel() {
    setFirstName(savedData.firstName);
    setLastName(savedData.lastName);
    setEmail(savedData.email);
    setEditing(false);
  }

  return (
    <div>
      <TextField
        label="Imię"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={`${styles.halfWidthInput} ${styles.input}`}
        margin="normal"
        disabled={!editing}
      />
      <TextField
        label="Nazwisko"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className={`${styles.halfWidthInput} ${styles.input}`}
        margin="normal"
        disabled={!editing}
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        className={styles.input}
        margin="normal"
        disabled={!editing}
      />
      <div className={styles.btns}>
        {editing ? (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
            >
              Anuluj&nbsp;
              <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button variant="contained" color="success" onClick={handleSave}>
              Zapisz&nbsp;
              <FontAwesomeIcon icon={faSave} />
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={() => setEditing(true)}>
            Edytuj&nbsp;
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        )}
      </div>

      <div className={styles.newPasswordContainer}>
        <h2>Zmiana hasła</h2>
        <TextField
          label="Obecne hasło"
          type="password"
          value={oldpassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nowe hasło"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Powtórz nowe hasło"
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          className={styles.newPassBtn}
          onClick={handleNewPassword}
        >
          Zmień hasło
        </Button>
      </div>
    </div>
  );
};

export default AccountForm;

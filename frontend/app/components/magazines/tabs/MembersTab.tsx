import React from "react";
import { Publisher, User } from "@/app/types/types";
import styles from "../Modal.module.css";
import { deletePublisherMember, getPublisherMembers } from "@/app/utils/publisher-helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useUI } from "@/app/context/UIContext";
import { IconButton, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const MembersTab = ({
    publisher,
    members,
    setMembers,
}: {
    publisher: Publisher;
    members: User[] | null;
    setMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}) => {
    const { showConfirm, showSnackbar } = useUI();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            if (publisher.id && (!members || members.length === 0)) {
                setLoading(true);
                try {
                    const fetchedMembers = await getPublisherMembers(publisher.id);
                    setMembers(fetchedMembers);
                } catch (error) {
                    console.error("Failed to load members", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchMembers();
    }, [publisher.id, members, setMembers]);

    function handleDeleteClick(user_id: number, username: string) {
        showConfirm(
            "Jesteś pewien?",
            `Czy na pewno chcesz usunąć użytkownika ${username} z czasopisma?`,
            async () => {
                if (!publisher.id) return;

                try {
                    await deletePublisherMember(publisher.id, user_id);
                    setMembers((prevMembers) =>
                        prevMembers ? prevMembers.filter((member) => member.id !== user_id) : null
                    );
                    showSnackbar("Użytkownik usunięty pomyślnie", "success");
                } catch (error) {
                    console.error("Error deleting publisher member:", error);
                }
            }
        );
    }

    return (
        <div style={{ padding: '20px 0' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <div className={styles.memberList}>
                    <div className={styles.memberListHeader}>Imię i nazwisko</div>
                    <div className={styles.memberListHeader}>Akcje</div>
                    {members && members.map((member: User) => (
                        <React.Fragment key={member.id}>
                            <div className={styles.memberFullname} title={member.email}>{member.first_name} {member.last_name}</div>
                            <div className={styles.memberActions}>
                                <IconButton onClick={() => handleDeleteClick(member.id, member.username)} size="small" color="error">
                                    <FontAwesomeIcon icon={faClose} className={styles.closeBtn} />
                                </IconButton>
                            </div>
                        </React.Fragment>
                    ))}
                    {(!members || members.length === 0) && <div style={{ padding: '1rem', gridColumn: 'span 2' }}>Brak członków w czasopiśmie.</div>}
                </div>
            )}
        </div>
    );
};

export default MembersTab;

import { PaperStatus } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faHourglass, faInfoCircle, faEdit } from "@fortawesome/free-solid-svg-icons";


const statusDisplayTextMap: { [key in PaperStatus]: string } = {
    [PaperStatus.Pending]: "Oczekuje na recenzje",
    [PaperStatus.Approved]: "Zaakceptowany",
    [PaperStatus.Published]: "Opublikowany",
    [PaperStatus.Rejected]: "Odrzucony",
    [PaperStatus.WaitingForRevision]: "Oczekuje na poprawki",
};

export const getPaperStatusDisplayText = (status: PaperStatus): string => {
    return statusDisplayTextMap[status] || "Nieznany";
};

export const getPaperStatusIcon = (status: PaperStatus) => {
    switch (status) {
        case PaperStatus.Pending:
            return <FontAwesomeIcon icon={faHourglass} />;
        case PaperStatus.Approved:
            return <FontAwesomeIcon icon={faCheckCircle} />;
        case PaperStatus.Rejected:
            return <FontAwesomeIcon icon={faBan} />;
        case PaperStatus.WaitingForRevision:
            return <FontAwesomeIcon icon={faEdit} />;
        default:
            return <FontAwesomeIcon icon={faInfoCircle} />;
    }
};
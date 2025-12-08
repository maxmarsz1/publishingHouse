import { Status } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faHourglass, faInfoCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const statusDisplayTextMap: { [key in Status]: string } = {
    [Status.Sent]: "Wysłany",
    [Status.Pending]: "Oczekuje na recenzje",
    [Status.Approved]: "Zaakceptowany",
    [Status.Published]: "Opublikowany",
    [Status.Rejected]: "Odrzucony",
};

export const getStatusDisplayText = (status: Status): string => {
    return statusDisplayTextMap[status] || "Nieznany";
};

export const getStatusIcon = (status: Status) => {
    switch (status) {
        case Status.Sent:
            return <FontAwesomeIcon icon={ faPaperPlane } />;
        case Status.Pending:
            return <FontAwesomeIcon icon={ faHourglass } />;
        case Status.Approved:
            return <FontAwesomeIcon icon={ faCheckCircle } />;
        case Status.Rejected:
            return <FontAwesomeIcon icon={ faBan } />;
        default:
            return <FontAwesomeIcon icon={ faInfoCircle } />;
    }
};
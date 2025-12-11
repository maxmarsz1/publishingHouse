import { ArticleStatus } from "../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faHourglass, faInfoCircle, faEdit } from "@fortawesome/free-solid-svg-icons";


const statusDisplayTextMap: { [key in ArticleStatus]: string } = {
    [ArticleStatus.Pending]: "Oczekuje na recenzje",
    [ArticleStatus.Approved]: "Zaakceptowany",
    [ArticleStatus.Published]: "Opublikowany",
    [ArticleStatus.Rejected]: "Odrzucony",
    [ArticleStatus.WaitingForRevision]: "Oczekuje na poprawki",
};

export const getStatusDisplayText = (status: ArticleStatus): string => {
    return statusDisplayTextMap[status] || "Nieznany";
};

export const getStatusIcon = (status: ArticleStatus) => {
    switch (status) {
        case ArticleStatus.Pending:
            return <FontAwesomeIcon icon={faHourglass} />;
        case ArticleStatus.Approved:
            return <FontAwesomeIcon icon={faCheckCircle} />;
        case ArticleStatus.Rejected:
            return <FontAwesomeIcon icon={faBan} />;
        case ArticleStatus.WaitingForRevision:
            return <FontAwesomeIcon icon={faEdit} />;
        default:
            return <FontAwesomeIcon icon={faInfoCircle} />;
    }
};
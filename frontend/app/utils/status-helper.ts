import { Status } from "../types/types";

const statusDisplayTextMap: { [key in Status]: string } = {
    [Status.Sent]: "Wyslany",
    [Status.Pending]: "Oczekuje na recenzje",
    [Status.Reviewed]: "Zrecenzowany",
    [Status.Published]: "Opublikowany",
    [Status.Rejected]: "Odrzucony",
};

export const getStatusDisplayText = (status: Status): string => {
    return statusDisplayTextMap[status] || "Nieznany";
};
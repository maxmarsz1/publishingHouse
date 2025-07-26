export interface Publisher {
    id: number;
    name: string;
    description: string;
}

export interface Raport {
    id: number,
    title: string,
    status: Status,
    grade: number
}

export enum Status{
    Sent = 1,
    Pending,
    Reviewed,
    Published,
    Rejected
}
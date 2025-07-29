import { Publisher } from "../types/types"

export function getPublisherData(id: number): Publisher{
    // mocking data fetching from backend
    return {
        id: id,
        name: "Dump publisher",
        description: "Lorem ipsum longer description of publisher here continue with the lorem ipsum text and then again with more text"
    }
}
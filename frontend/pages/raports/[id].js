import { useRouter } from "next/router";

export default function Raports() {
    const router = useRouter();
    const { id } = router.query;
    return <h1>raports {id}</h1>;
}
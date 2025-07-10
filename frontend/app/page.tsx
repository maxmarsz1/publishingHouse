import Image from "next/image";
import styles from "./page.module.css"; 
import Link from "next/link";
import { Container } from "@mui/material";
import ProductCard from "./components/ProductCard";

export default function Home() {
  return (
    <Container>
      <h1>Hello world</h1>
      <Link href="/users">Users</Link>
      <ProductCard/>
    </Container>
  );
}

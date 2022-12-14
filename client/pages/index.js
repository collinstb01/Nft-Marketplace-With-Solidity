import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <nav>
        <Link href="/">Nft Marketplace</Link>
        <Link href="/sell-nft">Sell Nft</Link>
      </nav>
    </div>
  );
}

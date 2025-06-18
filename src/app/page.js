"use client";

import Image from "next/image";
import styles from "./page.module.css";
import MTAArrivals from "../components/MTAArrivals/MTAArrivals";
import Precip from "../components/Precip/Precip";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.mta}>
        <MTAArrivals />
      </div>
      <div className={styles.precip}>
        <Precip />
      </div>
      <div className={styles.tempSun}></div>
    </div>
  );
}

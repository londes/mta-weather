"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import MTAArrivals from "../components/MTAArrivals/MTAArrivals";
import Precip from "../components/Precip/Precip";
import WeatherForecast from "../components/WeatherForecast/WeatherForecast";

export default function Home() {
  return (
    <div className={styles.page}>
      <Link href="/settings" className={styles.settingsButton}>
        ⚙️
      </Link>
      <div className={styles.mta}>
        <MTAArrivals />
      </div>
      <div className={styles.weatherContainer}>
        <div className={styles.weather}>
          <WeatherForecast />
        </div>
        <div className={styles.precip}>
          <Precip />
        </div>
      </div>
    </div>
  );
}

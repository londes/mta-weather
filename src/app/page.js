"use client";

import Image from "next/image";
import styles from "./page.module.css";
import MTAArrivals from "../components/MTAArrivals/MTAArrivals";
import Precip from "../components/Precip/Precip";
import WeatherForecast from "../components/WeatherForecast/WeatherForecast";

export default function Home() {
  return (
    <div className={styles.page}>
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
      <div className={styles.tempSun}></div>
    </div>
  );
}

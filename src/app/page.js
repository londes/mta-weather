"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [mtaData, setMtaData] = useState(null);

  useEffect(() => {
    console.log("fetching mta data");
    fetch("/api/mta")
      .then((res) => res.json())
      .then((data) => {
        console.log("MTA data received:", data);
        setMtaData(data);
      })
      .catch((error) => {
        console.error("Error fetching MTA data:", error);
      });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.mta}>
        {mtaData ? (
          <div>
            <h2>G Train Data</h2>
            <p>Entities: {mtaData.entityCount}</p>
            <p>Last Updated: {mtaData.timestamp}</p>
            {mtaData.error && <p style={{color: 'red'}}>Error: {mtaData.error}</p>}
          </div>
        ) : (
          <p>Loading MTA data...</p>
        )}
      </div>
      <div className={styles.precip}></div>
      <div className={styles.tempSun}></div>
    </div>
  );
}

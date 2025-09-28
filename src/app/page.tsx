"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Todo from "../components/Todo";
import Weather from "../components/Weather";
import Calculator from "../components/Calculator";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Weather /> */}

        <Calculator />
        <Todo />
      </main>
    </div>
  );
}

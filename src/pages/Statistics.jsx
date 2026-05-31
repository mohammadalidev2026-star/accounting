import React from "react";
import Header from "../components/Header";
import StatisticsExitModal from "../components/StatisticsExitModal";
import { useState } from "react";
import { STATISTICS } from "../graphql/Statistics";

export default function Statistics() {
  const [exitStatisticsModal, setExitStatisticsModal] = useState(f);

  return (
    <>
      <Header setExitModal={setExitStatisticsModal} />

      <div>Statistics</div>

      {exitStatisticsModal && (
        <StatisticsExitModal setExitStatisticsModal={setExitStatisticsModal} />
      )}
    </>
  );
}

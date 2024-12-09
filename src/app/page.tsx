"use client";
import PlayerImage from "@/components/blocks/PlayerImage";
import React, { useEffect, useState } from "react";
import { useCSVFile } from "@/app/_hooks/useCsvFile";
import { PlayerData } from "@/app/_models/player_data";
import TeamLogo from "@/components/blocks/TeamLogo";
import PlayerDataCard from "@/components/blocks/PlayerDataCard";

export default function Home() {
  const csvFile = useCSVFile<PlayerData>("./2024_nba_data.csv");

  const [player, setPlayer] = useState<PlayerData>();
  useEffect(() => {
    if (!csvFile.isLoading && csvFile.csvData.length > 0) {
      setPlayer(csvFile.csvData[0]);
    }
  }, [csvFile.isLoading]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className={"w-full p-4 gap-4 grid grid-cols-1 md:grid-cols-2 "}>
          {csvFile.csvData.length > 0 &&
            csvFile.csvData
              .slice(0, 100)
              .map((player, index) => (
                <PlayerDataCard
                  key={player.player_full_name + player.Team + index}
                  player={player}
                />
              ))}
        </div>
      </main>
    </div>
  );
}

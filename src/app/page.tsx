"use client";
import React, { useState, useEffect } from "react";
import { useCSVFile } from "@/app/_hooks/useCsvFile";
import { PlayerData } from "@/app/_models/player_data";
import PlayerDataCard from "@/components/blocks/PlayerDataCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlayerSelectionEntry from "@/components/blocks/PlayerSelectionEntry";
import { Separator } from "@/components/ui/separator";
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
      <main className="w-full flex flex-col row-start-2 items-center justify-center space-y-4">
        <Card className={"w-full"}>
          <CardHeader>
            <CardTitle>球員篩選列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={
                "w-full grid grid-cols-5 max-h-[200px] overflow-auto gap-x-4 gap-y-1"
              }
            >
              {csvFile.csvData.length > 0 &&
                csvFile.csvData
                  .filter((player) => player.abbreviation)
                  .sort((a, b) => a.Team.localeCompare(b.Team))
                  .map((player, index) => {
                    return (
                      <PlayerSelectionEntry
                        key={player.player_id + index}
                        player={player}
                        onClick={() => setPlayer(player)}
                      />
                    );
                  })}
            </div>
          </CardContent>
        </Card>
        <div className={"w-full gap-4 grid grid-cols-1"}>
          {/*{csvFile.csvData.length > 0 &&*/}
          {/*  csvFile.csvData*/}
          {/*    .slice(0, 100)*/}
          {/*    .map((player, index) => (*/}
          {/*      <PlayerDataCard*/}
          {/*        key={player.player_full_name + player.Team + index}*/}
          {/*        player={player}*/}
          {/*      />*/}
          {/*    ))}*/}
          {player && <PlayerDataCard player={player} />}
          {/*<PlayerDataCard player={player} />*/}
        </div>
      </main>
    </div>
  );
}

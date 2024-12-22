"use client";
// import React, { useState, useEffect } from "react";

import { PlayerSearchContextProvider } from "@/app/_hooks/players/usePlayerSearch";
import PlayerSeasonDataVisualizationPanel from "@/components/blocks/app/PlayerSeasonDataVisualizationPanel";
import { useSearchParams } from "next/navigation";
import PlayerDataCard from "@/components/blocks/PlayerDataCard";
import { usePlayerInfo } from "@/app/_hooks/players/usePlayerInfo";

export default function Home() {
  const searchParams = useSearchParams();
  const player_id = searchParams.get("player_id") || "2544";
  const season = searchParams.get("season") || "2024";
  const { isPlayerLoading, player } = usePlayerInfo(player_id, season);
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col items-center justify-center space-y-4">
        {!isPlayerLoading && player && <PlayerDataCard player={player} />}
      </main>
    </div>
  );
}

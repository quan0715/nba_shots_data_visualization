"use client";
// import React, { useState, useEffect } from "react";

import { PlayerSearchContextProvider } from "@/app/_hooks/players/usePlayerSearch";
import PlayerSeasonDataVisualizationPanel from "@/components/blocks/app/PlayerSeasonDataVisualizationPanel";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col items-center justify-center space-y-4">
        <PlayerSearchContextProvider>
          <PlayerSeasonDataVisualizationPanel />
        </PlayerSearchContextProvider>
      </main>
    </div>
  );
}

"use client";
import React, { useEffect, useState, useContext, createContext } from "react";
import { PlayerData } from "@/app/_models/player_data";
import { SortAction, SortKey } from "@/components/blocks/search/SortObject";
import { useCSVFile } from "@/app/_hooks/useCsvFile";
// import {PlayerSearchContext, PlayerSearchContextType} from "@/app/_hooks/context/PlayerContext";
export type PlayerSearchContextType = {
  season: string;
  setSeason: React.Dispatch<React.SetStateAction<string>>;
  targetPlayer: PlayerData | undefined;
  setTargetPlayer: React.Dispatch<React.SetStateAction<PlayerData | undefined>>;
  playerList: PlayerData[];
  sortActions: SortAction[];
  setSortActions: React.Dispatch<React.SetStateAction<SortAction[]>>;
  setPlayerList: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  sortKeys: SortKey[];
};

export const PlayerSearchContext = createContext<PlayerSearchContextType>(
  null as unknown as PlayerSearchContextType,
);

export function PlayerSearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const csvFile = useCSVFile<PlayerData>("./2025_nba_data.csv");

  const [player, setPlayer] = useState<PlayerData>();
  const [playerList, setPlayerList] = useState<PlayerData[]>([]);
  const [sortActions, setSortActions] = useState<SortAction[]>([]);
  const [season, setSeason] = useState<string>("2024");
  const sortKeys: SortKey[] = [
    { key: "FG", label: "進球", type: "number" },
    { key: "PTS", label: "得分", type: "number" },
    { key: "Team", label: "隊伍", type: "text" },
    { key: "Three_P_P", label: "三分進球率", type: "number" },
    { key: "Two_P", label: "兩分進球率", type: "number" },
    { key: "FT_P", label: "罰球進球率", type: "number" },
  ];

  useEffect(() => {
    if (!csvFile.isLoading && csvFile.csvData.length > 0) {
      setPlayer(csvFile.csvData[0]);
      setPlayerList(csvFile.csvData);
    }
  }, [csvFile.isLoading]);

  return (
    <PlayerSearchContext.Provider
      value={{
        season,
        setSeason,
        playerList,
        sortActions,
        targetPlayer: player,
        setTargetPlayer: setPlayer,
        setSortActions,
        setPlayerList,
        sortKeys,
      }}
    >
      {children}
    </PlayerSearchContext.Provider>
  );
}

export function usePlayerSearch() {
  const context = useContext(PlayerSearchContext);
  if (!context) {
    throw new Error(
      "usePlayerSearch must be used within a PlayerSearchProvider",
    );
  }

  function getSearchResult() {
    return sortSearchResult(
      context.playerList.filter((player: PlayerData) => player.abbreviation),
    );
  }

  function sortSearchResult(playerList: PlayerData[]) {
    return playerList.sort((a, b) => {
      for (let i = 0; i < context.sortActions.length; i++) {
        const action = context.sortActions[i];
        const actionKey = action.key.key as keyof PlayerData;
        let comparison = 0;
        switch (action.key.type) {
          case "number":
            comparison = (a[actionKey] as number) - (b[actionKey] as number);
            break;
          case "text":
            comparison = (a[actionKey] as string).localeCompare(
              b[actionKey] as string,
            );
            break;
        }
        if (comparison !== 0) {
          return action.type === "asc" ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  function isKeySelected(key: SortKey) {
    return context.sortActions.some((action) => action.key.key === key.key);
  }

  function updateSortActions(action: SortAction) {
    context.setSortActions(
      context.sortActions.map((prevAction) => {
        if (prevAction.key === action.key) {
          return {
            key: action.key,
            type: action.type === "asc" ? "desc" : "asc",
          };
        }
        return prevAction;
      }),
    );
  }

  function removeSortActions(action: SortAction) {
    context.setSortActions(
      context.sortActions.filter((prevAction) => {
        return prevAction.key !== action.key;
      }),
    );
  }

  return {
    ...context,
    getSearchResult,
    updateSortActions,
    removeSortActions,
    sortKeyOptions: context.sortKeys.filter((key) => !isKeySelected(key)),
  };
}

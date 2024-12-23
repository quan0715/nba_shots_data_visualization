"use client";
import React, {
  useEffect,
  useState,
  useContext,
  createContext,
  useMemo,
} from "react";
import { PlayerSeasonData } from "@/app/_models/player_data";
import { SortAction, SortKey } from "@/components/blocks/search/SortObject";
import { useSearchParams } from "next/navigation";
// import {PlayerSearchContext, PlayerSearchContextType} from "@/app/_hooks/context/PlayerContext";
export type PlayerSearchContextType = {
  season: string;
  targetPlayer: PlayerSeasonData | undefined;
  setTargetPlayer: React.Dispatch<
    React.SetStateAction<PlayerSeasonData | undefined>
  >;
  playerList: PlayerSeasonData[];
  sortActions: SortAction[];
  setSortActions: React.Dispatch<React.SetStateAction<SortAction[]>>;
  setPlayerList: React.Dispatch<React.SetStateAction<PlayerSeasonData[]>>;
  sortKeys: SortKey[];
};

export const PlayerSearchContext = createContext<PlayerSearchContextType>(
  null as unknown as PlayerSearchContextType,
);

export function PlayerSearchContextProvider({
  season,
  children,
}: {
  season: string;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const playerId = searchParams.get("player_id");
  const [player, setPlayer] = useState<PlayerSeasonData>();
  const [playerList, setPlayerList] = useState<PlayerSeasonData[]>([]);
  const [sortActions, setSortActions] = useState<SortAction[]>([]);
  const sortKeys: SortKey[] = [
    { key: "FG", label: "進球", type: "number" },
    { key: "PTS", label: "得分", type: "number" },
    { key: "Team", label: "隊伍", type: "text" },
    { key: "Three_P_P", label: "三分進球率", type: "number" },
    { key: "Two_P", label: "兩分進球率", type: "number" },
    { key: "FT_P", label: "罰球進球率", type: "number" },
    { key: "AST", label: "助攻", type: "number" },
    { key: "TRB", label: "籃板", type: "number" },
    { key: "Pos", label: "位置", type: "text" },
    { key: "MP", label: "平均出場時間", type: "number" },
  ];

  const getPlayerList: Promise<PlayerSeasonData[]> = useMemo(async () => {
    const res = await fetch(
      `https://api.lbrt.tw/vis_final/team_info/?season=${season}`,
      {
        cache: "force-cache",
      },
    );
    return await res.json();
  }, [season]);

  useEffect(() => {
    // const getPlayerList = async () => {
    //   const res = await fetch(
    //     `https://api.lbrt.tw/vis_final/team_info/?season=${season}`,
    //   );
    //   const _playerList: PlayerSeasonData[] = await res.json();
    //   setPlayerList(_playerList);
    //   setPlayer(_playerList.find((player) => player.player_id === playerId));
    // };

    getPlayerList.then((data) => {
      setPlayerList(data);
      setPlayer(data.find((player) => player.player_id === playerId));
    });
  }, [season]);

  return (
    <PlayerSearchContext.Provider
      value={{
        season,
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

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("player_id")) {
      context.setTargetPlayer(
        context.playerList.find(
          (player) => player.player_id === searchParams.get("player_id"),
        ),
      );
    }
  }, []);
  if (!context) {
    throw new Error(
      "usePlayerSearch must be used within a PlayerSearchProvider",
    );
  }

  function getSearchResult() {
    return sortSearchResult(
      context.playerList.filter((player: PlayerSeasonData) => player.team_id),
    );
  }

  function sortSearchResult(playerList: PlayerSeasonData[]) {
    return playerList.sort((a, b) => {
      for (let i = 0; i < context.sortActions.length; i++) {
        const action = context.sortActions[i];
        const actionKey = action.key.key as keyof PlayerSeasonData;
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

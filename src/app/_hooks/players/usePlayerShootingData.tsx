import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { PlayerSeasonData } from "@/app/_models/player_data";
import { getPlayerInfo } from "@/app/_actions/getPlayerInfo";
import { PlayerShotsData } from "@/app/_models/player_shots_data";

export function usePlayerShootingData(playerId: string, season: string) {
  const [playerShootingData, setPlayerShootingData] =
    useState<PlayerShotsData[]>();
  const [isDataLoading, startGetDataTransition] = useTransition();

  const getDataFromRemote = useCallback(async () => {
    const apiURL = `https://api.lbrt.tw/vis_final/player_shots/?player_id=${playerId}&season=${season}`;
    const res = await fetch(apiURL, {
      cache: "force-cache",
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error("Failed to fetch player data");
    }
    // return await getPlayerInfo(playerId, season);
  }, [playerId, season]);

  useEffect(() => {
    startGetDataTransition(async () => {
      try {
        const data = await getDataFromRemote();
        setPlayerShootingData(data);
      } catch {
        console.log("Failed to fetch player shooting data");
      }
    });
  }, [playerId, season]);

  return useMemo(
    () => ({ playerShootingData, isDataLoading }),
    [playerShootingData, isDataLoading],
  );
}

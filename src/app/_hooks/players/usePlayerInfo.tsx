import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { PlayerSeasonData } from "@/app/_models/player_data";
import { getPlayerInfo } from "@/app/_actions/getPlayerInfo";

export function usePlayerInfo(playerId: string, season: string) {
  const [player, setPlayer] = useState<PlayerSeasonData>();
  const [isPlayerLoading, startGetInfoTransition] = useTransition();

  const getPlayerFromRemote = useCallback(async () => {
    return await getPlayerInfo(playerId, season);
  }, [playerId, season]);

  useEffect(() => {
    startGetInfoTransition(async () => {
      try {
        const data = await getPlayerFromRemote();
        setPlayer(data);
      } catch {
        const res = await fetch(
          `https://api.lbrt.tw/vis_final/team_info/?season=${season}`,
        );
        const _playerList: PlayerSeasonData[] = await res.json();
        console.log(_playerList);
        const _player = _playerList.find((p) => p.player_id === playerId);
        setPlayer(_player);
      }
    });
  }, [playerId, season]);

  return useMemo(
    () => ({ player, isPlayerLoading }),
    [player, isPlayerLoading],
  );
}

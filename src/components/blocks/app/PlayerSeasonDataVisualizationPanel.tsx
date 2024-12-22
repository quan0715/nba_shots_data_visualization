"use client";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import PlayerList from "@/components/blocks/PlayerList";
import PlayerDataCard from "@/components/blocks/PlayerDataCard";
import { useSearchParams } from "next/navigation";

function PlayerSeasonDataVisualizationPanel() {
  const { playerList } = usePlayerSearch();
  // console.log(targetPlayer);
  const searchParams = useSearchParams();
  const player_id = searchParams.get("player_id") || "2544";
  const targetPlayer = playerList.find(
    (player) => player.player_id === player_id,
  );

  return (
    <div className={"flex flex-col justify-center items-center space-y-4"}>
      {/*<PlayerList />*/}
      <div className={"w-full gap-4 grid grid-cols-1"}>
        {targetPlayer && <PlayerDataCard player={targetPlayer} />}
      </div>
    </div>
  );
}

export default PlayerSeasonDataVisualizationPanel;

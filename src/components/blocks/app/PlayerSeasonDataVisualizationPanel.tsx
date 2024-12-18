import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import PlayerList from "@/components/blocks/PlayerList";
import PlayerDataCard from "@/components/blocks/PlayerDataCard";

function PlayerSeasonDataVisualizationPanel() {
  const { targetPlayer } = usePlayerSearch();

  return (
    <div className={"flex flex-col justify-center items-center space-y-4"}>
      <PlayerList />
      <div className={"w-full gap-4 grid grid-cols-1"}>
        {targetPlayer && <PlayerDataCard player={targetPlayer} />}
      </div>
    </div>
  );
}

export default PlayerSeasonDataVisualizationPanel;

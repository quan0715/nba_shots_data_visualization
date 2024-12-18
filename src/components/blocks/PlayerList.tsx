"use client";
import { PlayerData } from "@/app/_models/player_data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerSelectionEntry from "@/components/blocks/PlayerSelectionEntry";
import React from "react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SortListComponent from "@/components/blocks/search/SortObject";
import { SortAction } from "@/components/blocks/search/SortObject";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";

type PlayerListProps = {
  players: PlayerData[];
  // onPlayerClick: (player: PlayerData) => void;
};
function PlayerList() {
  const { getSearchResult, setTargetPlayer } = usePlayerSearch();
  return (
    <Card className={"w-full"}>
      <CardHeader
        className={"flex flex-row justify-between items-center space-x-4"}
      >
        <CardTitle>球員篩選列表</CardTitle>
        <Select defaultValue={"2425"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={"賽季時間"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"2425"}>2024-2025</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <SortListComponent />
        <ScrollArea>
          <div
            className={"w-full grid grid-cols-5 max-h-[200px] gap-x-4 gap-y-1"}
          >
            {getSearchResult().length > 0 &&
              getSearchResult().map((player, index) => {
                return (
                  <PlayerSelectionEntry
                    key={player.player_id + index}
                    index={index}
                    player={player}
                    onClick={() => {
                      setTargetPlayer(player);
                    }}
                  />
                );
              })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default PlayerList;

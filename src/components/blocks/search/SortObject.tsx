"use client";
import { PlayerData } from "@/app/_models/player_data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerSelectionEntry from "@/components/blocks/PlayerSelectionEntry";
import React from "react";
import { Button } from "@/components/ui/button";
import { LuKey, LuPlus, LuTable, LuText, LuX } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbNumber } from "react-icons/tb";
import { useEffect, useState } from "react";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { MdDragIndicator } from "react-icons/md";
import { cn } from "@/lib/utils";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";

export type SortKey = {
  key: string;
  type: "text" | "number";
  label: string;
};

export type SortAction = {
  key: SortKey;
  type: "asc" | "desc";
};

type PlayerListProps = {
  players: PlayerData[];
  sortKey: SortKey[];
  onPlayerClick: (player: PlayerData) => void;
};
function SortKeySelectEntry({
  sortKey,
  callback,
}: {
  sortKey: SortKey;
  callback: () => void;
}) {
  function getIcon(keyType: typeof sortKey.type) {
    switch (keyType) {
      case "number":
        return <TbNumber />;
      case "text":
        return <LuText />;
      default:
        return <LuKey />;
    }
  }
  return (
    <Button
      variant={"ghost"}
      className={"w-full flex flex-row justify-start items-center"}
      onClick={callback}
    >
      {getIcon(sortKey.type)}
      {sortKey.label}
    </Button>
  );
}

function SortActionChip({
  sortAction,
  onStateChange,
  onRemove,
}: {
  sortAction: SortAction;
  onStateChange: (sortAction: SortAction) => void;
  onRemove: (sortAction: SortAction) => void;
}) {
  return (
    <div className={"w-full group flex flex-row justify-around items-center"}>
      <button
        className={"text-gray-500  p-2 hover:text-black hover:cursor-grab"}
      >
        <MdDragIndicator />
      </button>
      <Button
        variant={"outline"}
        onClick={() => onStateChange(sortAction)}
        className={"flex-1 flex flex-row justify-center items-center"}
      >
        <p className={"text-sm font-mono"}>{sortAction.key.label}</p>
        {sortAction.type === "asc" ? (
          <>
            - 升序
            <BsSortUp />
          </>
        ) : (
          <>
            - 降序
            <BsSortDown />
          </>
        )}
      </Button>
      <button
        onClick={() => onRemove(sortAction)}
        className={"text-gray-500  p-2 hover:text-black hover:cursor-pointer"}
      >
        <LuX />
      </button>
    </div>
  );
}

function SortListComponent() {
  const {
    sortKeys,
    sortActions,
    setSortActions,
    sortKeyOptions,
    updateSortActions,
    removeSortActions,
  } = usePlayerSearch();

  return (
    <div className={"mb-4 flex flex-row justify-start items-center space-x-4"}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "text-gray-500 rounded-full",
              sortActions.length > 0 ? "text-blue-500" : "bg-transparent",
            )}
          >
            {sortActions.length ? (
              `排序規則 (${sortActions.length})`
            ) : (
              <>
                <LuPlus />
                {`新增排序`}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <Label>排序規則</Label>
            {sortActions.length > 0 ? (
              <div
                className={
                  "w-full flex flex-col justify-start items-start space-y-2"
                }
              >
                {sortActions.map((action) => (
                  <SortActionChip
                    key={action.key.key}
                    sortAction={action}
                    onStateChange={updateSortActions}
                    onRemove={removeSortActions}
                  />
                ))}
              </div>
            ) : (
              <p className={"text-sm  font-semibold text-gray-500"}>無規則</p>
            )}
            <Label>選則欄位排序</Label>
            <div className={"flex flex-col justify-start items-start p-2"}>
              {sortKeyOptions.map((key) => (
                <SortKeySelectEntry
                  key={key.key}
                  sortKey={key}
                  callback={() => {
                    setSortActions([...sortActions, { key, type: "desc" }]);
                  }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SortListComponent;

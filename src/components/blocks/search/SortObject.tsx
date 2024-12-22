"use client";
import { PlayerSeasonData } from "@/app/_models/player_data";
import React from "react";
import { Button } from "@/components/ui/button";
import { LuKey, LuPlus, LuText } from "react-icons/lu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbNumber } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import { SortActionEntry } from "@/components/blocks/search/DraggableSortActionList";
import { Reorder } from "framer-motion";
import { BiSort } from "react-icons/bi";

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
  players: PlayerSeasonData[];
  sortKey: SortKey[];
  onPlayerClick: (player: PlayerSeasonData) => void;
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

function SortListComponent() {
  const { sortActions, setSortActions, sortKeyOptions } = usePlayerSearch();

  return (
    <div className={"flex flex-row justify-center items-center"}>
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
              <>
                <BiSort></BiSort>
                {`排序: ${sortActions.map((action) => action.key.label).join(", ")}`}
              </>
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
            {/*<DraggableSortActionList*/}
            {/*  actions={sortActions}*/}
            {/*  onOrderChange={setSortActions}*/}
            {/*/>*/}
            <Reorder.Group
              axis={"y"}
              values={sortActions}
              onReorder={setSortActions}
              style={{ width: "100%" }}
            >
              {sortActions.map((action, index) => (
                // <Reorder.Item key={action.key.key} value={action}>
                <SortActionEntry
                  key={`action-${action.key.key}-${index}`}
                  action={action}
                  index={index}
                />
                // </Reorder.Item>
              ))}
            </Reorder.Group>
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

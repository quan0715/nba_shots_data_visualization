"use client";
import { PlayerData } from "@/app/_models/player_data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerSelectionEntry from "@/components/blocks/PlayerSelectionEntry";

import SortListComponent from "@/components/blocks/search/SortObject";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PlayerList() {
  const { getSearchResult } = usePlayerSearch();
  const searchParams = useSearchParams();
  const season = searchParams.get("season");
  return (
    <Card className={"w-full"}>
      <CardHeader
        className={"flex flex-row justify-start items-center space-x-2"}
      >
        <CardTitle>NBA {`${season}`} 賽季球員列表</CardTitle>
        <SortListComponent />
      </CardHeader>
      <CardContent>
        <PlayerGallery players={getSearchResult()} />
      </CardContent>
    </Card>
  );
}

function PlayerGallery({ players }: { players: PlayerData[] }) {
  const { setTargetPlayer } = usePlayerSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handlePlayerClick(player: PlayerData) {
    setTargetPlayer(player);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("playerId", Math.round(player.player_id).toString());
    const newURL = `/?${newParams.toString()}`;
    router.push(newURL);
  }
  return (
    <ScrollArea>
      <div className={"w-full grid grid-cols-5 max-h-[200px] gap-x-4 gap-y-1"}>
        {players.length > 0 &&
          players.map((player, index) => {
            return (
              <Suspense>
                <PlayerSelectionEntry
                  key={player.player_id + index}
                  index={index}
                  player={player}
                  onClick={() => handlePlayerClick(player)}
                />
              </Suspense>
            );
          })}
      </div>
    </ScrollArea>
  );
}

// const DraggableBox = () => {
//   const containerRef = useRef(null);
//   const boxRef = useRef(null);
//
//   const [isDragging, setIsDragging] = useState(false);
//   const [offsetX, setOffsetX] = useState(0);
//   const [offsetY, setOffsetY] = useState(0);
//
//   const [boxPos, setBoxPos] = useState({ x: 0, y: 0 });
//
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!isDragging) return;
//
//       const container = containerRef.current;
//       const box = boxRef.current;
//
//       const containerRect = container.getBoundingClientRect();
//
//       // newX/newY: 鼠標在 container 內的相對座標 - 方塊內偏移量
//       let newX = e.clientX - containerRect.left - offsetX;
//       let newY = e.clientY - containerRect.top - offsetY;
//
//       const boxRect = box.getBoundingClientRect();
//       const maxX = containerRect.width - boxRect.width;
//       const maxY = containerRect.height - boxRect.height;
//
//       newX = Math.max(0, Math.min(newX, maxX));
//       newY = Math.max(0, Math.min(newY, maxY));
//
//       setBoxPos({ x: newX, y: newY });
//     };
//
//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };
//
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     }
//
//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging, offsetX, offsetY]);
//
//   const handleMouseDown = (e) => {
//     const box = boxRef.current;
//     const boxRect = box.getBoundingClientRect();
//
//     // 記錄滑鼠在方塊內點擊的位置
//     const startX = e.clientX - boxRect.left;
//     const startY = e.clientY - boxRect.top;
//
//     setOffsetX(startX);
//     setOffsetY(startY);
//     setIsDragging(true);
//   };
//
//   return (
//     <div
//       ref={containerRef}
//       className="relative w-[300px] h-[300px] border-2 border-gray-300 select-none"
//     >
//       <div
//         ref={boxRef}
//         onMouseDown={handleMouseDown}
//         className="absolute w-[50px] h-[50px] bg-blue-500 cursor-grab"
//         style={{ top: `${boxPos.y}px` }}
//       ></div>
//     </div>
//   );
// };

export default PlayerList;

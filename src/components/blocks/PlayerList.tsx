"use client";
import { PlayerSeasonData } from "@/app/_models/player_data";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerSelectionEntry from "@/components/blocks/PlayerSelectionEntry";

import SortListComponent from "@/components/blocks/search/SortObject";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import { Suspense } from "react";

function PlayerList() {
  const { getSearchResult } = usePlayerSearch();
  return (
    <div className={"flex flex-col justify-start items-start h-full w-full"}>
      <SortListComponent />
      <PlayerGallery players={getSearchResult()} />;
    </div>
  );
}

function PlayerGallery({ players }: { players: PlayerSeasonData[] }) {
  return (
    <ScrollArea
      className={"w-full flex flex-col justify-start items-start h-[600px]"}
    >
      {players.length > 0 &&
        players.map((player, index) => {
          return (
            <Suspense
              key={`player-${player.player_id}-${index}-${player.team_id}-${player.Player}`}
            >
              <div className={"mb-2"}>
                <PlayerSelectionEntry index={index} player={player} />
              </div>
            </Suspense>
          );
        })}
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

import React, { useRef, useState, useEffect, ReactElement } from "react";
import { SortAction } from "@/components/blocks/search/SortObject";
import { usePlayerSearch } from "@/app/_hooks/players/usePlayerSearch";
import { Button } from "@/components/ui/button";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { LuX } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Reorder, useDragControls } from "framer-motion";
interface Props {
  actions: SortAction[];
  onOrderChange: (actions: SortAction[]) => void;
}

const ManualDragSortActionList: React.FC<Props> = ({
  actions,
  onOrderChange,
}) => {
  const dragImageRef = useRef<HTMLDivElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggingIndex(index);
    event.dataTransfer.setData("text/plain", index.toString());
    event.dataTransfer.setDragImage(dragImageRef.current as Element, 0, 0);
  };

  const onDropHandler = (
    event: React.DragEvent<HTMLDivElement>,
    numberIndex: number,
  ) => {
    event.preventDefault();
    if (draggingIndex === null) {
      return;
    }
    const newActions = [...actions];
    const [draggedItem] = newActions.splice(draggingIndex, 1);
    newActions.splice(numberIndex, 0, draggedItem);
    onOrderChange(newActions);
    setDraggingIndex(null);
  };

  const NoneRule = () => (
    <p className={"text-sm font-semibold text-gray-500"}>無規則</p>
  );

  return actions.length > 0 ? (
    <div className="w-full flex flex-col justify-center items-center space-y-1 relative">
      <div
        ref={dragImageRef}
        style={{
          position: "absolute",
          opacity: "100%",
          width: "100%",
          top: "-9999px",
          left: "-9999px",
        }}
      >
        {draggingIndex && (
          <SortActionEntry
            action={actions[draggingIndex ?? 0]}
            index={draggingIndex}
          />
        )}
      </div>
      {actions.map((action, index) => {
        return (
          <div key={action.key.key + index} className={"w-full"}>
            <DragIndicator
              beforeItemIndex={index - 1}
              onDropHandler={onDropHandler}
            />
            <SortActionEntry
              draggable={true}
              onDragStart={(event: React.DragEvent<HTMLDivElement>) =>
                handleDragStart(event, index)
              }
              onDrag={(event: React.DragEvent<HTMLDivElement>) => {
                event.preventDefault();
                event.dataTransfer.setDragImage(
                  document.getElementById(
                    `dragging-${draggingIndex}`,
                  ) as Element,
                  0,
                  0,
                );
              }}
              key={action.key.key}
              onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
                event.preventDefault();
                if (draggingIndex === null) {
                  return;
                }
                const newActions = [...actions];
                const [draggedItem] = newActions.splice(draggingIndex, 1);
                newActions.splice(index, 0, draggedItem);
                onOrderChange(newActions);
                setDraggingIndex(null);
              }}
              action={action}
              index={index}
            />
          </div>
        );
      })}
      <DragIndicator
        beforeItemIndex={actions.length}
        onDropHandler={onDropHandler}
      />
    </div>
  ) : (
    <NoneRule />
  );
};

function DragIndicator({
  beforeItemIndex = -1,
  onDropHandler = () => {},
  ...props
}: {
  action?: SortAction;
  beforeItemIndex?: number;
  onDropHandler?: (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      {...props}
      onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={(event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDropHandler(event, beforeItemIndex);
        setIsDragging(false);
      }}
      onDragLeaveCapture={() => setIsDragging(false)}
      key={`placeholder-b-${beforeItemIndex}`}
      className={cn(
        "w-full my-0.5 min-h-1 rounded-full flex flex-col justify-center items-center opacity-0 bg-blue-50",
        isDragging && `bg-blue-500 opacity-100`,
      )}
    />
  );
}

export function SortActionEntry({
  action,
  index,
  className,
  ...props
}: {
  action: SortAction;
  className?: string;
  index: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { updateSortActions, removeSortActions } = usePlayerSearch();
  const controls = useDragControls();
  return (
    <Reorder.Item value={action}>
      <div
        {...props}
        id={`dragging-${index}`}
        key={action.key.key}
        className="w-full group flex flex-row justify-around items-center bg-white m-1 p-1"
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="text-gray-500 p-2 hover:text-black hover:cursor-grab active:cursor-grabbing"
        >
          <MdDragIndicator />
        </div>
        <Button
          variant={"outline"}
          onClick={() => updateSortActions(action)}
          className={"flex-1 flex flex-row justify-center items-center"}
        >
          <p className={"text-sm font-mono"}>{action.key.label}</p>
          {action.type === "asc" ? (
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
          onClick={() => removeSortActions(action)}
          className={"text-gray-500 p-2 hover:text-black hover:cursor-pointer"}
        >
          <LuX />
        </button>
      </div>
    </Reorder.Item>
  );
}

export default ManualDragSortActionList;

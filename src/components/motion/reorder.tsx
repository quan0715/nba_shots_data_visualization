// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useLayoutEffect,
//   useMemo,
// } from "react";
// import { createContext } from "react";
//
// interface ReorderContextValue<T> {
//   registerItem(value: T, ref: React.RefObject<HTMLLIElement>): void;
//   unregisterItem(value: T): void;
//   startDrag(value: T, pointerY: number): void;
//   onPointerMove(pointerY: number): void;
//   onPointerUp(): void;
//   getStyleForItem(value: T): React.CSSProperties;
//   values: T[];
// }
//
// export const ReorderContext = createContext<ReorderContextValue<any> | null>(
//   null,
// );
//
// interface ReorderProps<T> {
//   values: T[];
//   onReorder: (newValues: T[]) => void;
//   children?: React.ReactNode;
// }
//
// interface ReorderItemProps<T> {
//   value: T;
//   children?: React.ReactNode;
// }
//
// interface ReorderComponent<T> extends React.FC<ReorderProps<T>> {
//   Item: React.FC<ReorderItemProps<T>>;
// }
//
// export const Reorder = (<T extends string | number>({
//   values,
//   onReorder,
//   children,
// }: ReorderProps<T>) => {
//   const [items, setItems] = useState(values);
//
//   useEffect(() => {
//     setItems(values);
//   }, [values]);
//
//   const itemRefs = useRef<Map<T, React.RefObject<HTMLLIElement>>>(new Map());
//   const draggingValueRef = useRef<T | null>(null);
//   const initialPointerYRef = useRef<number>(0);
//   const [dragOffsetY, setDragOffsetY] = useState(0);
//
//   // 儲存前後位置，用來實作 FLIP 動畫
//   const positionsRef = useRef<Map<T, DOMRect>>(new Map());
//
//   // 儲存目前狀態渲染後的項目位置
//   function measurePositions() {
//     positionsRef.current.clear();
//     for (const [value, ref] of itemRefs.current.entries()) {
//       if (ref.current) {
//         positionsRef.current.set(value, ref.current.getBoundingClientRect());
//       }
//     }
//   }
//
//   useLayoutEffect(() => {
//     measurePositions();
//   }, [items, dragOffsetY]);
//
//   const registerItem = (value: T, ref: React.RefObject<HTMLLIElement>) => {
//     itemRefs.current.set(value, ref);
//   };
//
//   const unregisterItem = (value: T) => {
//     itemRefs.current.delete(value);
//   };
//
//   const startDrag = (value: T, pointerY: number) => {
//     draggingValueRef.current = value;
//     initialPointerYRef.current = pointerY;
//   };
//
//   const onPointerMoveHandler = (pointerY: number) => {
//     const draggingValue = draggingValueRef.current;
//     if (!draggingValue) return;
//
//     const deltaY = pointerY - initialPointerYRef.current;
//     setDragOffsetY(deltaY);
//
//     const currentPos = positionsRef.current.get(draggingValue);
//     if (!currentPos) return;
//
//     const draggingTop = currentPos.top + deltaY;
//     const draggingBottom = draggingTop + currentPos.height;
//
//     // 檢查重疊
//     for (const [value, rect] of positionsRef.current.entries()) {
//       if (value === draggingValue) continue;
//       const overlap = calcOverlap(
//         draggingTop,
//         draggingBottom,
//         rect.top,
//         rect.bottom,
//       );
//       if (overlap > rect.height / 2) {
//         // 執行交換前先記錄 "First" 狀態
//         const firstPositions = new Map<T, DOMRect>();
//         for (const [v, r] of positionsRef.current.entries()) {
//           firstPositions.set(v, r);
//         }
//
//         // 執行交換
//         const oldIndex = items.indexOf(draggingValue);
//         const newIndex = items.indexOf(value);
//         if (oldIndex !== -1 && newIndex !== -1) {
//           const newItems = [...items];
//           const temp = newItems[oldIndex];
//           newItems[oldIndex] = newItems[newIndex];
//           newItems[newIndex] = temp;
//           setItems(newItems);
//           onReorder(newItems);
//
//           // 渲染後(下個 useLayoutEffect)會更新 positionsRef(current positions)
//           requestAnimationFrame(() => {
//             // "Last" 狀態，新的位置已經更新在 positionsRef
//             const lastPositions = new Map<T, DOMRect>(positionsRef.current);
//             // 執行 FLIP 動畫
//             playFLIPAnimation(firstPositions, lastPositions);
//           });
//           break;
//         }
//       }
//     }
//   };
//
//   const onPointerUpHandler = () => {
//     draggingValueRef.current = null;
//     setDragOffsetY(0);
//   };
//
//   const getStyleForItem = (value: T): React.CSSProperties => {
//     const draggingValue = draggingValueRef.current;
//     if (draggingValue === value) {
//       return {
//         position: "relative",
//         zIndex: 50,
//         transform: `translateY(${dragOffsetY}px)`,
//         background: "#f0f0f0",
//         opacity: 0.8,
//         transition: "transform 0.2s ease",
//       };
//     }
//     return {
//       transition: "transform 0.2s ease",
//     };
//   };
//
//   const contextValue = useMemo(
//     () => ({
//       registerItem,
//       unregisterItem,
//       startDrag,
//       onPointerMove: onPointerMoveHandler,
//       onPointerUp: onPointerUpHandler,
//       getStyleForItem,
//       values: items,
//     }),
//     [items, dragOffsetY],
//   );
//
//   return (
//     <ReorderContext.Provider value={contextValue}>
//       <ul className="list-none p-0 m-0 relative">{children}</ul>
//     </ReorderContext.Provider>
//   );
// }) as ReorderComponent<any>;
//
// const ReorderItem = <T extends string | number>({
//   value,
//   children,
// }: ReorderItemProps<T>) => {
//   const ref = useRef<HTMLLIElement>(null);
//   const ctx = React.useContext(ReorderContext);
//
//   useEffect(() => {
//     ctx?.registerItem(value, ref);
//     return () => {
//       ctx?.unregisterItem(value);
//     };
//   }, [ctx, value]);
//
//   if (!ctx) return null;
//
//   return (
//     <li
//       ref={ref}
//       style={ctx.getStyleForItem(value)}
//       className="border border-gray-300 rounded px-2 py-1 bg-white mb-2 flex items-center"
//     >
//       <div
//         className="w-5 h-5 mr-2 bg-gray-300 rounded cursor-grab"
//         onPointerDown={(e) => {
//           e.currentTarget.setPointerCapture(e.pointerId);
//           ctx.startDrag(value, e.clientY);
//         }}
//         onPointerMove={(e) => ctx.onPointerMove(e.clientY)}
//         onPointerUp={(e) => {
//           e.currentTarget.releasePointerCapture(e.pointerId);
//           ctx.onPointerUp();
//         }}
//       />
//       {children || value}
//     </li>
//   );
// };
//
// Reorder.Item = ReorderItem;
//
// function calcOverlap(
//   top1: number,
//   bottom1: number,
//   top2: number,
//   bottom2: number,
// ): number {
//   const overlapTop = Math.max(top1, top2);
//   const overlapBottom = Math.min(bottom1, bottom2);
//   return Math.max(0, overlapBottom - overlapTop);
// }
//
// // 執行 FLIP 動畫的函式
// function playFLIPAnimation<T extends string | number>(
//   firstPositions: Map<T, DOMRect>,
//   lastPositions: Map<T, DOMRect>,
// ) {
//   for (const [value, lastRect] of lastPositions.entries()) {
//     const itemElement = lastRectToElement(lastRect);
//     if (!itemElement) continue;
//
//     const firstRect = firstPositions.get(value);
//     if (!firstRect) continue;
//
//     const dx = firstRect.left - lastRect.left;
//     const dy = firstRect.top - lastRect.top;
//
//     // 初始設置 transform 使元素看起來還在舊位置
//     itemElement.style.transition = "none";
//     itemElement.style.transform = `translate(${dx}px, ${dy}px)`;
//
//     requestAnimationFrame(() => {
//       // 移除 transform，透過 CSS transition 讓他們平滑過渡到新位置
//       itemElement.style.transition = "transform 0.2s ease";
//       itemElement.style.transform = "";
//     });
//   }
// }
//
// // 根據位置來取得對應的 DOM element
// // 本範例中已透過 ref 擁有元素，但此為示意，可根據狀況調整
// function lastRectToElement(rect: DOMRect): HTMLElement | null {
//   // 在此示範中，我們透過比較 rect 來嘗試找到對應的 DOM element
//   // 實務上可直接透過 ref 在外面記錄每個 item element
//   // 這裡為示範簡化，實際中建議直接使用記錄的 ref 來匹配。
//
//   // 由於已在上層透過 ref 管理，最好在此加入對應的從 ref 取得 element 的邏輯
//   // 此範例假設 rect 直接對應 element，但在實務中，請修改為透過 ref 來取得 element。
//   return null; // 這裡先留空，因為我們在此範例設計中實際用不到這個函數。
// }

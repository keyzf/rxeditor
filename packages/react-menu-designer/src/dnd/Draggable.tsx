import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DraggableChildrenFn, DraggleProvider, IDraggableSnapshot, Identifier } from "./types";
import { DRAGGABLE_ATTR_ID_NAME, DRAGGABLE_HNADLER_ATTR_ID_NAME } from "./consts";
import { useDndSnapshot } from "./hooks/useDndSnapshot";
import styled from "styled-components";
import { useChildItemsState } from "./hooks/useChildItemsState";
import { DraggableContext } from "./contexts";

const MouseFollower = styled.div`
  position: fixed;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  display: flex;
`

export type DraggableProps = {
  //鼠标跟随跟条目等宽
  //keepMouseFollowerWidth?: boolean,
  draggableId: Identifier;
  index?: number;
  clonable?: boolean;
  //鼠标跟随物
  //mouseFollower?: React.ReactNode;
  children?: DraggableChildrenFn;
  hasHandler?: boolean;
}

export const Draggable = memo((
  props: DraggableProps
) => {
  const { draggableId, index, clonable, children, hasHandler } = props
  const [element, setElement] = useState<HTMLElement>()
  //const [rect, setRect] = useState<DOMRect>()
  const followerRef = useRef<HTMLDivElement>(null)
  const dndSnapshot = useDndSnapshot()
  const [, setItems] = useChildItemsState() || []

  //向容器注册组件
  useEffect(() => {
    if (!setItems) {
      return
    }

    setItems((items) => {
      const newItems = items.filter(item => item.id !== draggableId)
      const realIndex = index === undefined ? newItems.length : index
      newItems.push({ id: draggableId, index: realIndex })
      newItems.sort((a, b) => a.index - b.index)
      return newItems
    })

    return () => {
      setItems((items) => {
        return items.filter(item => item.id !== draggableId)
      })
    }
  }, [draggableId, index, setItems])

  //const follerRef = mouseFollower ? mouseFollowerRef.current : element

  const handleRefChange = useCallback((element?: HTMLElement | null) => {
    element?.setAttribute(DRAGGABLE_ATTR_ID_NAME, draggableId.toString())
    if (!hasHandler) {
      element?.setAttribute(DRAGGABLE_HNADLER_ATTR_ID_NAME, draggableId.toString())
    }
    setElement(element || undefined)
  }, [draggableId, hasHandler])

  const handleHanderRefChange = useCallback((element?: HTMLElement | null) => {
    element?.setAttribute(DRAGGABLE_HNADLER_ATTR_ID_NAME, draggableId.toString())
  }, [draggableId])

  const snapshot: IDraggableSnapshot = useMemo(() => {
    return {
      isDragging: dndSnapshot.draggingId === draggableId,
      draggingOffset: dndSnapshot.draggingOffset,
    }
  }, [dndSnapshot.draggingId, dndSnapshot.draggingOffset, draggableId])

  useEffect(() => {
    const followerElement = followerRef.current
    if (dndSnapshot.draggingId === draggableId && draggableId) {
      followerElement?.style.setProperty("opacity", "1");
      if (dndSnapshot.draggingOffset) {
        followerElement?.style.setProperty("transform", `translate(${dndSnapshot.draggingOffset.x}px,${dndSnapshot.draggingOffset.y}px)`)
      }
    } else {
      followerElement?.style.removeProperty("opacity")
      followerElement?.style.removeProperty("transform")
    }
  }, [dndSnapshot.draggingOffset, dndSnapshot.draggingId, draggableId])

  // useEffect(() => {
  //   if (dndSnapshot.draggingId === draggableId) {
  //     setRect(element?.getBoundingClientRect())
  //     element?.style.setProperty("pointer-events", "none")
  //     if (!clonable) {
  //       const display = element?.style.getPropertyValue("display")
  //       element?.style.setProperty("display", "none")
  //       return () => {
  //         element?.style.setProperty("display", display || "")
  //         element?.style.setProperty("pointer-events", "all")
  //       }
  //     }

  //     return () => {
  //       element?.style.setProperty("pointer-events", "all")
  //     }
  //   }
  // }, [clonable, dndSnapshot.draggingId, draggableId, element])

  // useEffect(() => {
  //   const newElement = element?.cloneNode(true)
  //   const followerElement = followerRef.current
  //   if (followerElement && newElement && !mouseFollower) {
  //     followerElement.appendChild(newElement)
  //     return () => {
  //       followerElement.removeChild(newElement)
  //     }
  //   }
  // }, [element, mouseFollower])

  const provider: DraggleProvider = useMemo(() => {
    return {
      innerRef: handleRefChange,
      handlerRef: handleHanderRefChange,
    }
  }, [handleHanderRefChange, handleRefChange])

  return (
    <DraggableContext.Provider value={draggableId}>
      {
        children && children(provider, snapshot)
      }
      {/* <MouseFollower
        ref={followerRef}
        style={{
          left: rect?.left,
          top: rect?.top,
          width: rect?.width,
          height: rect?.height,
        }}
      >
        {
          mouseFollower
        }
      </MouseFollower> */}
    </DraggableContext.Provider>
  )
})
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DraggableChildrenFn, IDraggableStateSnapshot, Identifier } from "./types";
import { DRAGGABLE_ATTR_ID_NAME } from "./consts";
import { useDndSnapshot } from "./hooks/useDndSnapshot";
import styled from "styled-components";

const MouseFollower = styled.div`
  position: fixed;
  z-index: 1;
`

export type DraggableProps = {
  draggableId: Identifier;
  index?: number;
  clonable?: boolean;
  //目标位置的占位符
  renderPlaceholder?: React.ReactNode;
  //鼠标跟随物
  mouseFollower?: React.ReactNode;
  children?: DraggableChildrenFn;
}

export const Draggable = memo((
  props: DraggableProps
) => {
  const { draggableId, clonable, mouseFollower, children } = props
  const [ref, setRef] = useState<HTMLElement>()
  const mouseFollowerRef = useRef<HTMLDivElement>(null)
  const dndSnapshot = useDndSnapshot()

  const follerRef = mouseFollower ? mouseFollowerRef.current : ref

  const handleRefChange = useCallback((element?: HTMLElement | null) => {
    element?.setAttribute(DRAGGABLE_ATTR_ID_NAME, draggableId.toString())
    setRef(element || undefined)
  }, [draggableId])

  const snapshot: IDraggableStateSnapshot = useMemo(() => {
    return {
      isDragging: dndSnapshot.draggingId === draggableId,
    }
  }, [dndSnapshot.draggingId, draggableId])

  useEffect(() => {
    if (dndSnapshot.draggingId === draggableId && draggableId) {
      if (dndSnapshot.draggingOffset) {
        follerRef?.style.setProperty("transform", `translate(${dndSnapshot.draggingOffset.x}px,${dndSnapshot.draggingOffset.y}px)`)
        if (!follerRef?.style.getPropertyValue('z-index')) {
          follerRef?.style.setProperty("z-index", "1")
        }
      }
    } else {
      follerRef?.style.setProperty("transform", `translate(0px,0px)`)
      follerRef?.style.removeProperty("z-index")
    }
  }, [dndSnapshot.draggingOffset, dndSnapshot.draggingId, draggableId, follerRef?.style])

  return (
    <>
      {
        children && children(handleRefChange, snapshot)
      }
      {
        snapshot.isDragging && mouseFollower && <MouseFollower
          ref={mouseFollowerRef}
          style={{
            left: ref?.getBoundingClientRect().left,
            top: ref?.getBoundingClientRect().top,
            width: ref?.getBoundingClientRect().width,
            height: ref?.getBoundingClientRect().height,
          }}
        >
          {
            mouseFollower
          }
        </MouseFollower>
      }
    </>
  )
})
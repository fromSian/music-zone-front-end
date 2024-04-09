import { Song } from "@/types/musicInfo";
import {
  Active,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useMemo, useState } from "react";
import SortableItem, { DragHandle } from "./SortableItem";
import styles from "./SortableList.module.less";
import SortableOverlay from "./SortableOverlay";

export type ItemType = Song;

interface SortableListProps {
  items: ItemType[];
  onChange: (items: Song[]) => void;
  renderItem: (item: Song) => ReactNode;
}

const SortableList = ({ items, onChange, renderItem }: SortableListProps) => {
  const [active, setActive] = useState<Active>();
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over.id);
      onChange(arrayMove(items, activeIndex, overIndex));
    }
    setActive(undefined);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className={styles.sortable_list_ul}>
          {items.map((item) => (
            <SortableItem item={item} key={item.id}>
              {renderItem(item)}
              <DragHandle />
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? (
          <SortableItem item={activeItem}>
            {renderItem(activeItem)}
            <DragHandle />
          </SortableItem>
        ) : (
          ""
        )}
      </SortableOverlay>
    </DndContext>
  );
};

export default SortableList;

import { HolderOutlined } from "@ant-design/icons";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CSSProperties,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";
import styles from "./SortableItem.module.less";
import { ItemType } from "./SortableList";

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

const SortableItem = ({
  children,
  item,
}: PropsWithChildren & { item: ItemType }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const context = useMemo(() => {
    return {
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    };
  }, [attributes, listeners, setActivatorNodeRef]);

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <SortableItemContext.Provider value={context}>
      <li ref={setNodeRef} style={style} className={styles.sortable_item}>
        {children}
      </li>
    </SortableItemContext.Provider>
  );
};

export default SortableItem;

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <div
      className={styles.drag_handle}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <HolderOutlined />
    </div>
  );
}

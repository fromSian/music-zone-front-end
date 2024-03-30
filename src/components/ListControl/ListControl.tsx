import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { changePlayingListOrder } from "@/states/playing.slice";
import { SongType } from "@/types/musicInfo";
import SortableList from "../SortableList/SortableList";
import Item from "./Item";

const ListControl = () => {
  const { listInPlayOrder } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();

  const onChange = (items: SongType[]) => {
    dispatch(changePlayingListOrder(items));
  };

  const renderItem = (item: SongType) => <Item item={item} />;
  return (
    <div>
      <SortableList
        items={listInPlayOrder}
        onChange={onChange}
        renderItem={renderItem}
      />
    </div>
  );
};

export default ListControl;

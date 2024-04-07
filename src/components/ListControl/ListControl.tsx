import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { changePlayingListOrder } from "@/states/playing.slice";
import { Song } from "@/types/musicInfo";
import { Empty } from "antd";
import SortableList from "../SortableList/SortableList";
import Item from "./Item";

const ListControl = () => {
  const { listInPlayOrder } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();

  const onChange = (items: Song[]) => {
    dispatch(changePlayingListOrder(items));
  };

  const renderItem = (item: Song) => <Item item={item} />;
  return (
    <>
      {listInPlayOrder.length ? (
        <SortableList
          items={listInPlayOrder}
          onChange={onChange}
          renderItem={renderItem}
        />
      ) : (
        <Empty />
      )}
    </>
  );
};

export default ListControl;

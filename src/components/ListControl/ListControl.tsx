import { useState } from "react";
// import SortableList from "../SortableList/SortableList";
import { SongType } from "@/types/musicInfo";
import SortableList from "../SortableList/SortableList";
import Item from "./Item";

const ListControl = () => {
  const [items, setItems] = useState<SongType[]>([
    {
      name: "你在烦恼什么",
      album: "你在烦恼什么",
      artist: "苏打绿",
      audio: "audio1",
      id: 5,
    },
    {
      name: "起来",
      album: "小宇宙",
      artist: "苏打绿",
      audio: "audio2",
      id: 1,
    },
    {
      name: "起21来",
      album: "小宇宙",
      artist: "苏打绿",
      audio: "audio2",
      id: 2,
    },
    {
      name: "起2131来 234234kjlfhds fsjkayrewiuryw fsdalfuewoirywierwekn, sd,fk 43284503824gestuoiweoi",
      album: "小宇宙",
      artist: "苏打绿",
      audio: "audio2",
      id: 3,
    },
  ]);

  const renderItem = (item: SongType) => <Item item={item} />;
  return (
    <div>
      <SortableList items={items} onChange={setItems} renderItem={renderItem} />
    </div>
  );
};

export default ListControl;

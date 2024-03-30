import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { removeOne } from "@/states/playing.slice";
import { SongType } from "@/types/musicInfo";
import {
  DeleteOutlined,
  HeartOutlined,
  HeartTwoTone,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Popconfirm, Tooltip } from "antd";
import classnames from "classnames";
import { useCallback, useState } from "react";
import PlayingIcon from "../PlayingIcon/PlayingIcon";
import styles from "./Item.module.less";
const Item = ({ item }: { item: SongType }) => {
  const { playingSong, isPlaying } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();
  const handleDelete = useCallback(() => {
    dispatch(removeOne(item.id));
  }, [item.id]);

  const [deletePopOpen, setDeletePopOpen] = useState(false);
  return (
    <div className={styles.play}>
      {/* 是否播放中 & 立即播放 */}
      <div className={styles.play_status}>
        {isPlaying && playingSong.id === item.id ? (
          <>
            <PlayingIcon className={styles.play_status_icon_animate} />
            <PauseCircleOutlined className={styles.play_status_icon_static} />
          </>
        ) : (
          <PlayCircleOutlined />
        )}
      </div>
      <div className={styles.play_info}>
        <Tooltip title={item.name}>
          <p className={styles.play_info_name}>{item.name}</p>
        </Tooltip>
        <Tooltip title={item.artist}>
          <p className={styles.play_info_artist}>{item.artist}</p>
        </Tooltip>
      </div>

      <div
        className={classnames(styles.play_operator, {
          [styles.play_operator_visible]: deletePopOpen,
        })}
      >
        <Tooltip title={true ? "取消收藏" : "收藏"}>
          <div className={styles.play_operator_love}>
            {true ? <HeartTwoTone /> : <HeartOutlined />}
          </div>
        </Tooltip>

        <Popconfirm
          title="删除"
          description="确认从播放列表中删除这首？"
          onConfirm={handleDelete}
          onCancel={() => {
            setDeletePopOpen(false);
          }}
          okText="确认"
          cancelText="取消"
          open={deletePopOpen}
        >
          <DeleteOutlined onClick={() => setDeletePopOpen((v) => !v)} />
        </Popconfirm>
      </div>
    </div>
  );
};

export default Item;

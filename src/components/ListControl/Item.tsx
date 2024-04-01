import { useAppDispatch, useAppSelector } from "@/states/hooks";
import {
  changePlayingSong,
  removeOne,
  setPlaying,
} from "@/states/playing.slice";
import { SongType } from "@/types/musicInfo";
import { Popconfirm, Tooltip } from "antd";
import classnames from "classnames";
import { useCallback, useState } from "react";
import {
  DeleteIcon,
  HeartFullIcon,
  HeartLineIcon,
  PauseIcon,
  PlayIcon,
} from "../Icons/Icons";
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
    <div
      className={classnames(styles.play, {
        [styles.playing]: playingSong.id === item.id,
      })}
    >
      {/* 是否播放中 & 立即播放 */}
      <div className={styles.play_status}>
        <PlayingIcon
          isAnimate={true}
          className={classnames(styles.play_status_icon, {
            [styles.play_status_playing_animate]:
              playingSong.id === item.id && isPlaying,
          })}
        />
        <PlayingIcon
          className={classnames(styles.play_status_icon, {
            [styles.play_status_playing_noanimate]:
              playingSong.id === item.id && !isPlaying,
          })}
        />

        <PlayIcon
          className={classnames(
            styles.play_status_icon,
            {
              [styles.play_status_play]: playingSong.id !== item.id,
            },
            {
              [styles.play_status_play_hover]:
                playingSong.id === item.id && !isPlaying,
            }
          )}
          onClick={() => {
            dispatch(changePlayingSong(item));
            dispatch(setPlaying(true));
          }}
        />

        <PauseIcon
          className={classnames(styles.play_status_icon, {
            [styles.play_status_pause]: playingSong.id === item.id && isPlaying,
          })}
          onClick={() => {
            dispatch(setPlaying(false));
          }}
        />
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
            {true ? <HeartFullIcon /> : <HeartLineIcon />}
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
          <DeleteIcon onClick={() => setDeletePopOpen((v) => !v)} />
        </Popconfirm>
      </div>
    </div>
  );
};

export default Item;

import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { clearAll, setPanelVisible } from "@/states/playing.slice";
import { ClearOutlined, CloseOutlined } from "@ant-design/icons";
import classnames from "classnames";
import { useEffect, useState } from "react";
import ListControl from "../ListControl/ListControl";
import styles from "./playinglist.module.less";
const PlayingList = () => {
  const [isFirst, setIsFirst] = useState(true);
  const { panelVisible } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (panelVisible) {
      setIsFirst(false);
    }
  }, [panelVisible]);
  return (
    <div
      className={classnames(
        styles.playlist,
        {
          [styles.playlist_in]: panelVisible,
        },
        {
          [styles.playlist_out]: !isFirst && !panelVisible,
        },
        {
          [styles.playlist_out_first]: isFirst && !panelVisible,
        }
      )}
    >
      <header className={styles.playlist_header}>
        <p className={styles.playlist_header_name}>播放列表</p>

        <div className={styles.playlist_header_right}>
          <ClearOutlined
            className={styles.playlist_header_icon}
            onClick={() => {
              dispatch(clearAll());
            }}
          />
          <CloseOutlined
            className={styles.playlist_header_icon}
            onClick={() => {
              dispatch(setPanelVisible(false));
            }}
          />
        </div>
      </header>
      <div className={styles.playlist_list}>
        <ListControl />
      </div>
    </div>
  );
};

export default PlayingList;

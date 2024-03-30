import { SongType } from "@/types/musicInfo";
import {
  DeleteOutlined,
  HeartOutlined,
  HeartTwoTone,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import styles from "./Item.module.less";
const Item = ({ item }: { item: SongType }) => {
  return (
    <div className={styles.play}>
      {/* 是否播放中 & 立即播放 */}
      <div className={styles.play_status}>
        {true ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
      </div>
      <div className={styles.play_info}>
        <Tooltip title={item.name}>
          <p className={styles.play_info_name}>{item.name}</p>
        </Tooltip>
        <Tooltip title={item.artist}>
          <p className={styles.play_info_artist}>{item.artist}</p>
        </Tooltip>
      </div>

      <div className={styles.play_operator}>
        <Tooltip title={true ? "取消收藏" : "收藏"}>
          <div className={styles.play_operator_love}>
            {true ? <HeartTwoTone /> : <HeartOutlined />}
          </div>
        </Tooltip>

        <Tooltip title="删除">
          <DeleteOutlined />
        </Tooltip>
      </div>
    </div>
  );
};

export default Item;

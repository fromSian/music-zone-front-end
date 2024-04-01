import { Select, Tooltip } from "antd";
import classnames from "classnames";
import { shuffle } from "lodash";
import { useState } from "react";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { AddIcon, HeartLineIcon, PlayIcon } from "../Icons/Icons";
import { rankingSongs, rankingTypes } from "./data";
import styles from "./index.module.less";

const Ranking = () => {
  const [selectedType, setSelectedType] = useState<string | number>(
    rankingTypes[0].value
  );
  const [songs, setSongs] = useState(shuffle(rankingSongs));

  const handleTypeChange = (value: number | string) => {
    setSongs(shuffle(rankingSongs));
    setSelectedType(value);
  };

  return (
    <div className={styles.ranking}>
      <div className={styles.list_select}>
        <ul>
          {rankingTypes.map((type) => (
            <li
              className={classnames(styles.list_select_item, {
                [styles.list_select_item_active]: selectedType === type.value,
              })}
              key={type.value}
              onClick={() => handleTypeChange(type.value)}
            >
              <div className={styles.list_select_item_content}>
                <div className={styles.list_select_item_content_line} />
                <p className={styles.list_select_item_content_label}>
                  {type.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.dropdown_select}>
        <Select
          options={rankingTypes}
          value={selectedType}
          onChange={handleTypeChange}
        />
      </div>
      <div className={styles.ranking_list}>
        <ol>
          {songs.map((song, index) => (
            <li className={styles.ranking_list_item} key={song.id}>
              <div className={styles.ranking_list_item_content}>
                <p className={styles.ranking_list_item_content_index}>
                  {index + 1}
                </p>
                <div className={styles.ranking_list_item_content_image}>
                  <BsFillMusicPlayerFill
                    className={styles.ranking_list_item_content_image_main}
                  />
                  <PlayIcon
                    className={styles.ranking_list_item_content_image_play}
                  />
                </div>
                <div className={styles.ranking_list_item_content_info}>
                  <p className={styles.ranking_list_item_content_name}>
                    {song.name}
                  </p>
                  <p className={styles.ranking_list_item_content_artist}>
                    {song.artist}
                  </p>
                </div>
                <div className={styles.ranking_list_item_content_operator}>
                  <Tooltip title={"加入播放列表"}>
                    <AddIcon
                      className={styles.ranking_list_item_content_operator_icon}
                    />
                  </Tooltip>
                  <Tooltip title={"喜欢"}>
                    <HeartLineIcon
                      className={styles.ranking_list_item_content_operator_icon}
                    />
                  </Tooltip>
                  <Tooltip title={"播放"}>
                    <PlayIcon
                      className={styles.ranking_list_item_content_operator_icon}
                    />
                  </Tooltip>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Ranking;

import { ListResult, PlayRecordList } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { joinList2Str } from "@/utils/text";
import { Empty, Popover, Select, Spin, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { shuffle } from "lodash";
import { useCallback, useRef, useState } from "react";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { useQuery } from "react-query";
import { AddIcon, HeartLineIcon, PlayIcon } from "../Icons/Icons";
import { rankingSongs, rankingTypes } from "./data";
import styles from "./index.module.less";

const Ranking = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [selectedType, setSelectedType] = useState<string | number>(
    rankingTypes[0].value
  );
  const [songs, setSongs] = useState(shuffle(rankingSongs));

  const handleTypeChange = (value: number | string) => {
    setSongs(shuffle(rankingSongs));
    setSelectedType(value);
  };

  const [playlist, setPlaylist] = useState([
    {
      id: "1",
      name: "1",
    },
    {
      id: "2",
      name: "2",
    },
  ]);

  const { isLoading, isFetching, isSuccess, data } = useQuery({
    queryKey: ["recently"],
    queryFn: async () => {
      try {
        const result: AxiosResponse<ListResult<PlayRecordList>> =
          await request.get(`/play-record/?order=-count&size=50`);
        return result.data.results;
      } catch (err) {
        console.log(getErrorMessage(err));
      }
    },
  });

  const handleAddToPlaylist = useCallback(() => {
    console.log("add");
  }, []);

  return (
    <div className={styles.ranking} ref={wrapRef}>
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
        {isLoading || isFetching ? (
          <Spin />
        ) : isSuccess && data && data.length ? (
          <ol>
            {data.map((item, index) => (
              <li className={styles.ranking_list_item} key={item.id}>
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
                      {item.detail?.name}
                    </p>
                    {item.type === "ALBUM" || item.type === "SONG" ? (
                      <p className={styles.ranking_list_item_content_artist}>
                        {joinList2Str(item.detail?.artist, "name")}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <p className={styles.ranking_list_item_content_count}>5次</p>
                  {item.type === "SONG" && (
                    <div className={styles.ranking_list_item_content_operator}>
                      <Popover
                        rootClassName={styles.playlist}
                        placement="left"
                        getPopupContainer={() => wrapRef.current as HTMLElement}
                        content={
                          <>
                            {playlist.map((item) => (
                              <div
                                className={styles.playlist_content}
                                key={item.id}
                                onClick={handleAddToPlaylist}
                              >
                                加入 <a>{item.name}</a>
                              </div>
                            ))}
                          </>
                        }
                        title={"加入播放列表/歌单"}
                        trigger={"click"}
                      >
                        <AddIcon
                          className={
                            styles.ranking_list_item_content_operator_icon
                          }
                        />
                      </Popover>
                      <Tooltip title={"喜欢"}>
                        <HeartLineIcon
                          className={
                            styles.ranking_list_item_content_operator_icon
                          }
                        />
                      </Tooltip>
                      <Tooltip title={"播放"}>
                        <PlayIcon
                          className={
                            styles.ranking_list_item_content_operator_icon
                          }
                        />
                      </Tooltip>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default Ranking;

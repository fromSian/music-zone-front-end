import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { addOne, setPlaying } from "@/states/playing.slice";
import { ListResult, PlayRecordList } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { joinList2Str } from "@/utils/text";
import { Empty, Select, Spin, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddIcon, HeartFullIcon, HeartLineIcon } from "../Icons/Icons";
import PlayStatus from "../PlayStatus/PlayStatus";
import styles from "./index.module.less";
export const rankingTypes = [
  {
    label: "总榜",
    value: "all",
  },
  {
    label: "歌曲",
    value: "SONGS",
  },
  {
    label: "专辑",
    value: "ALBUMS",
  },
  {
    label: "歌单",
    value: "PLAYLISTS",
  },
  // {
  //   label: "艺人",
  //   value: "ARTISTS",
  // },
];
const Ranking = () => {
  const { isPlaying, playingSong } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [selectedType, setSelectedType] = useState<string>(
    rankingTypes[0].value
  );
  const [data, setData] = useState<PlayRecordList[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const query = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsSuccess(false);
      const result: AxiosResponse<ListResult<PlayRecordList>> =
        await request.get(
          `/play-record/?order=-count&size=50&type=${selectedType}`
        );
      if (result && result.data && result.data.results) {
        setIsSuccess(true);
        setData(result.data.results);
      }
    } catch (err) {
      console.log(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    query();
  }, [query]);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  const handleGoTo = useCallback((item: PlayRecordList) => {
    if (item.type === "SONGS") {
      window.open(`/library/albums/${item.detail.album.id}/${item.detail.id}`);
    } else {
      window.open(
        `/library/${item.type.toLocaleLowerCase()}/${item.target_id}`
      );
    }
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
        {isLoading ? (
          <Spin />
        ) : isSuccess && data && data.length ? (
          <ol>
            {data.map((item, index) => (
              <li className={styles.ranking_list_item} key={item.id}>
                <div className={styles.ranking_list_item_content}>
                  <p className={styles.ranking_list_item_content_index}>
                    {index + 1}
                  </p>
                  {selectedType === "all" && (
                    <p className={styles.ranking_list_item_content_type}>
                      {item.type}
                    </p>
                  )}

                  <div className={styles.ranking_list_item_content_info}>
                    <p
                      className={styles.ranking_list_item_content_name}
                      onClick={() => handleGoTo(item)}
                    >
                      {item.detail?.name}
                    </p>
                    {item.type === "ALBUMS" || item.type === "SONGS" ? (
                      <p className={styles.ranking_list_item_content_artist}>
                        {joinList2Str(item.detail?.artist, "name")}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>

                  {item.type === "SONGS" && (
                    <div className={styles.ranking_list_item_content_operator}>
                      <Tooltip title={"加入播放列表"}>
                        <AddIcon
                          onClick={() => {
                            dispatch(
                              addOne({ song: item.detail, isPlayNow: false })
                            );
                          }}
                          className={
                            styles.ranking_list_item_content_operator_icon
                          }
                        />
                      </Tooltip>
                      <Tooltip title={"喜欢"}>
                        {item.detail.isLiked ? (
                          <HeartFullIcon
                            className={
                              styles.ranking_list_item_content_operator_icon
                            }
                          />
                        ) : (
                          <HeartLineIcon
                            className={
                              styles.ranking_list_item_content_operator_icon
                            }
                          />
                        )}
                      </Tooltip>

                      <PlayStatus
                        playingSong={playingSong}
                        isPlaying={isPlaying}
                        item={item.detail}
                        handlePlay={() => {
                          dispatch(
                            addOne({ song: item.detail, isPlayNow: true })
                          );
                        }}
                        handlePause={() => {
                          dispatch(setPlaying(false));
                        }}
                      />
                    </div>
                  )}

                  <p className={styles.ranking_list_item_content_count}>5次</p>
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

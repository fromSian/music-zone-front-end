import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { addLoveRecord } from "@/states/loves.slice";
import { addOne, setPlaying } from "@/states/playing.slice";
import { ListResult, PlayRecordList } from "@/types/musicInfo";
import { loveOrNotASong } from "@/utils/api";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { joinList2Str } from "@/utils/text";
import { Divider, Select, Spin, Tooltip, message } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { map } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
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
    value: "songs",
  },
  {
    label: "专辑",
    value: "albums",
  },
  {
    label: "歌单",
    value: "playlists",
  },
  // {
  //   label: "艺人",
  //   value: "ARTISTS",
  // },
];
const size = 10;
const Ranking = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { isPlaying, playingSong } = useAppSelector((state) => state.playing);
  const { loveOperationData } = useAppSelector((state) => state.love);
  const dispatch = useAppDispatch();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<PlayRecordList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const controllerRef = useRef<AbortController>();

  const pageRef = useRef(1);

  const loadMoreData = useCallback(
    async (type: string, page: number, size: number) => {
      if (isLoading) {
        return;
      }
      try {
        setIsLoading(true);
        if (controllerRef.current) {
          controllerRef.current.abort();
          controllerRef.current = undefined;
        }

        controllerRef.current = new AbortController();
        const result: AxiosResponse<ListResult<PlayRecordList>> =
          await request.get(
            `/play-record/?order=-count&size=${size}&page=${page}&type=${type.toUpperCase()}`
          );
        if (result && result.data && result.data.results) {
          setData((data) => [...data, ...result.data.results]);
          pageRef.current = pageRef.current + 1;
          setTotal(result.data.count);
        }
      } catch (err) {
        console.log(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!type || !map(rankingTypes, "value").includes(type)) {
      navigate(`/rank/all`);
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = undefined;
    }
    setData([]);
    pageRef.current = 1;
    setTotal(undefined);
    loadMoreData(type, 1, size);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = undefined;
      }
    };
  }, [type]);

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
          {rankingTypes.map((item) => (
            <li
              className={classnames(styles.list_select_item, {
                [styles.list_select_item_active]: type === item.value,
              })}
              key={item.value}
              onClick={() => navigate(`/rank/${item.value}`)}
            >
              <div className={styles.list_select_item_content}>
                <div className={styles.list_select_item_content_line} />
                <p className={styles.list_select_item_content_label}>
                  {item.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.dropdown_select}>
        <Select
          options={rankingTypes}
          value={type}
          onChange={(value) => navigate(`/rank/${value}`)}
        />
      </div>
      <div className={styles.ranking_list} id="scrollContent">
        <ol>
          <InfiniteScroll
            dataLength={data.length}
            next={() => loadMoreData(type || "all", pageRef.current, size)}
            hasMore={total === undefined || data.length < total}
            loader={
              <Divider>
                <Spin />
              </Divider>
            }
            endMessage={<Divider plain>已加载全部🫠</Divider>}
            scrollableTarget={"scrollContent"}
          >
            {data.map((item, index) => (
              <li className={styles.ranking_list_item} key={item.id}>
                <div className={styles.ranking_list_item_content}>
                  <p className={styles.ranking_list_item_content_index}>
                    {index + 1}
                  </p>
                  {type === "all" && (
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
                        {(
                          loveOperationData.hasOwnProperty(item.target_id)
                            ? loveOperationData[item.target_id]
                            : item.detail.isLiked
                        ) ? (
                          <HeartFullIcon
                            className={
                              styles.ranking_list_item_content_operator_icon
                            }
                            onClick={async () => {
                              try {
                                const res = await loveOrNotASong(
                                  item.detail.id,
                                  false
                                );
                                if (res) {
                                  dispatch(
                                    addLoveRecord({
                                      id: item.detail.id,
                                      isLoved: false,
                                    })
                                  );
                                  message.success("取消收藏成功");
                                } else {
                                  message.error("取消收藏失败");
                                }
                              } catch (err) {
                                message.error("取消收藏失败");
                                getErrorMessage(err);
                              }
                            }}
                          />
                        ) : (
                          <HeartLineIcon
                            className={
                              styles.ranking_list_item_content_operator_icon
                            }
                            onClick={async () => {
                              try {
                                const res = await loveOrNotASong(
                                  item.detail.id,
                                  true
                                );
                                if (res) {
                                  dispatch(
                                    addLoveRecord({
                                      id: item.detail.id,
                                      isLoved: true,
                                    })
                                  );
                                  message.success("收藏成功");
                                } else {
                                  message.error("收藏失败");
                                }
                              } catch (err) {
                                message.error("收藏失败");
                                getErrorMessage(err);
                              }
                            }}
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

                  <p className={styles.ranking_list_item_content_count}>
                    {item.count}次
                  </p>
                </div>
              </li>
            ))}
          </InfiniteScroll>
        </ol>
      </div>
    </div>
  );
};

export default Ranking;

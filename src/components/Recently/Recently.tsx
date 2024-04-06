import { ListResult, PlayRecordList, PlayRecordType } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { Empty, Spin } from "antd";
import { AxiosResponse } from "axios";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { PlayRecordDefaultIcon } from "../Icons/Icons";
import styles from "./Recently.module.less";

const Recently = () => {
  const navigate = useNavigate();
  const { isLoading, isFetching, isSuccess, data } = useQuery({
    queryKey: ["recently"],
    queryFn: async () => {
      try {
        const result: AxiosResponse<ListResult<PlayRecordList>> =
          await request.get(
            `/play-record/?order=-update_time&size=12&type=PLAYLIST,ALBUM,ARTIST`
          );
        return result.data.results;
      } catch (err) {
        console.log(getErrorMessage(err));
      }
    },
  });

  const handleGoTo = useCallback((type: PlayRecordType, id: string) => {
    navigate(`/library/${type.toLocaleLowerCase()}/${id}`);
  }, []);

  return (
    <div className={styles.recently}>
      <p className={styles.recently_header}>最近播放</p>

      <div className={styles.recently_content}>
        {isLoading || isFetching ? (
          <Spin />
        ) : isSuccess && data && data.length ? (
          data.map((item) => (
            <div
              className={styles.recently_content_item}
              key={item.id}
              onClick={() => handleGoTo(item.type, item.target_id)}
            >
              <div className={styles.recently_content_item_image}>
                {item.detail?.hasOwnProperty("image") && item.detail.image ? (
                  <img src={item.detail?.image} />
                ) : (
                  <PlayRecordDefaultIcon />
                )}
              </div>
              <p className={styles.recently_content_item_name}>
                {item.detail?.name}
              </p>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default Recently;

import PlayList from "@/components/PlayList/PlayList";
import commonStyles from "./common.module.less";
const PlaylistInfo = () => {
  return (
    <div className={commonStyles.content}>
      <PlayList />
    </div>
  );
};

export default PlaylistInfo;

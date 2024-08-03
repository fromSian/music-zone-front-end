import Album from "@/components/Album/Album";
import commonStyles from "./common.module.less";
const AlbumInfo = () => {
  return (
    <div className={commonStyles.content}>
      <Album />
    </div>
  );
};

export default AlbumInfo;

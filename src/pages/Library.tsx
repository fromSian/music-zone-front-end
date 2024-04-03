import MusicLibrary from "@/components/MusicLibrary/MusicLibrary";
import commonStyles from "./common.module.less";
const Library = () => {
  return (
    <div className={commonStyles.content}>
      <MusicLibrary />
    </div>
  );
};

export default Library;

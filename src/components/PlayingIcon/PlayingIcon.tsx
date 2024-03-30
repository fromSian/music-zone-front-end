import classnames from "classnames";
import styles from "./PlayingIcon.module.less";
const PlayingIcon: React.FC<{ className: string }> = ({ className }) => {
  return (
    <>
      <div className={classnames(styles.circle, className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={styles.rect} key={`rect${index}`} />
        ))}
      </div>
    </>
  );
};

export default PlayingIcon;

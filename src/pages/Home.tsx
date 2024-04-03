import Banner from "@/components/Banner/Banner";
import Recently from "@/components/Recently/Recently";
import commonStyles from "./common.module.less";

const Home = () => {
  return (
    <div className={commonStyles.content}>
      <Banner />
      <Recently />
    </div>
  );
};

export default Home;

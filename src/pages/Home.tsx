import Banner from "@/components/Banner/Banner";
import Recently from "@/components/Recently/Recently";
import { useEffect, useTransition } from "react";
import commonStyles from "./common.module.less";

const Home = () => {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      console.log("start");
      setTimeout(() => {
        console.log("done");
      }, 2000);
    });
  }, []);
  return (
    <div className={commonStyles.content}>
      <Banner />
      <Recently />
    </div>
  );
};

export default Home;

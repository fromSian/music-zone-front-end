import Banner from "@/components/Banner/Banner"
import commonStyles from './common.module.less'

const Home = () => {
    return (
        <div className={commonStyles.content}>
            <Banner />
        </div>
    )
}

export default Home

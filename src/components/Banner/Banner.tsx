import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { BannerItem } from './data'
import data from './data'
import styles from './index.module.less'

const BannerItem = ({ item, onMouseOver, onMouseLeave }: { item: BannerItem, onMouseOver: (e: MouseEvent) => void, onMouseLeave: (e: MouseEvent) => void, }) => {
    return <>
        <div className={styles.banner_item} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
            <p className={styles.banner_item_title}>{item.title} - {item.description}</p>
            {

            }
        </div>
    </>
}

const interval = 3000
const animationTime = 1000

const Banner = () => {
    const [bannerData, setBannerData] = useState([data[data.length - 1], ...data, data[0]])

    const [currentIndex, setCurrentIndex] = useState(1)
    const [translateX, setTranslateX] = useState<number>(-100 / bannerData.length * currentIndex)

    const [isAnimate, setIsAnimate] = useState(true)

    const animateRef = useRef<ReturnType<typeof setInterval>>()
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

    const move = useCallback((end: number) => {
        const per = 100 / bannerData.length
        setTranslateX(-per * end)
        setCurrentIndex(end)
    }, [])


    const next = useCallback(() => {
        if (currentIndex === bannerData.length - 2) {
            setTimeout(() => {
                setIsAnimate(false)
                move(1)
            }, animationTime);
        } else {
            setIsAnimate(true)
        }
        move(currentIndex + 1)
    }, [currentIndex])

    useEffect(() => {
        animateRef.current && clearInterval(animateRef.current)
        timeoutRef.current && clearTimeout(timeoutRef.current)
        animateRef.current = undefined
        timeoutRef.current = undefined
        animateRef.current = setInterval(next, interval)

        return () => {
            animateRef.current && clearInterval(animateRef.current)
            animateRef.current = undefined
        }
    }, [next])

    const onMouseOver = () => {
        animateRef.current && clearInterval(animateRef.current)
        timeoutRef.current && clearTimeout(timeoutRef.current)
        animateRef.current = undefined
        timeoutRef.current = undefined
    }

    const onMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            animateRef.current = setInterval(next, interval)
        }, interval)

    }, [next])


    return (
        <div className={styles.banner}>
            <LeftCircleOutlined className={classnames(styles.banner_direction_icon, styles.banner_left_icon,)} onClick={() => {
                if (currentIndex === 1) {
                    setTimeout(() => {
                        setIsAnimate(false)
                        move(bannerData.length - 2)
                    }, animationTime);
                } else {
                    setIsAnimate(true)
                }
                move(currentIndex - 1)

            }} />
            <RightCircleOutlined className={classnames(styles.banner_direction_icon, styles.banner_right_icon)} onClick={() => {
                if (currentIndex === bannerData.length - 2) {
                    setTimeout(() => {
                        setIsAnimate(false)
                        move(1)
                    }, animationTime);
                } else {
                    setIsAnimate(true)
                }
                move(currentIndex + 1)
            }} />
            <div className={classnames(styles.banner_content, { [styles.transition]: isAnimate })} style={{
                transform: `translateX(${translateX}%)`,
            }}>
                {
                    bannerData.map((item, index) => (<BannerItem onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} key={`banner_item${index}`} item={item} />))
                }
            </div>

        </div>
    )
}

export default Banner

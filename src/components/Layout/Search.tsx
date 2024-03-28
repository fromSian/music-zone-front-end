import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { useState } from 'react'
import styles from './index.module.less'

const SearchBar = () => {
    const [isHide, setIsHide] = useState(true)
    const [searchText, setSearchText] = useState('')

    return (
        <>
            <div className={classnames(styles.search, { [styles.search_expand]: !isHide })} onMouseOver={() => {
                isHide && setIsHide(false)
            }} onMouseLeave={() => {
                !searchText && setIsHide(true)
            }}>
                <input className={styles.search_input} type='text' value={searchText} onChange={(e) => { setSearchText(e.target.value) }} >
                </input>
                <CloseCircleOutlined className={classnames(styles.clear_icon, { [styles.clear_icon_show]: searchText })} onClick={() => {
                    setSearchText('')
                }} />
                <SearchOutlined className={styles.search_icon} />
            </div>

        </>
    )
}

export default SearchBar

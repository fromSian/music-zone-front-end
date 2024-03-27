import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, MenuProps } from 'antd';
import styles from './index.module.less';

const items: MenuProps['items'] = [
    {
        key: 'logout',
        label: '退出登陸'
    }
]
const AvatarCustom = () => {
    return (
        <Dropdown menu={{ items }}>
            <Badge count={1} className={styles.avatar_icon}>
                <Avatar size='small' icon={<UserOutlined />} />
            </Badge>
        </Dropdown>
    )
}

export default AvatarCustom

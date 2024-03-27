import { Layout, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import type { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { useEffect, useState } from 'react'
import type { RouteObject } from 'react-router-dom'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import AvatarCustom from './Avatar'
import SearchBar from './Search'

const { Header } = Layout
interface HeaderProps {
    routerConfig: (RouteObject & { name: string })[]
}

const HeaderCustom = ({ routerConfig }: HeaderProps) => {
    const location = useLocation()
    const [activeKeys, setActiveKeys] = useState<string[]>([])
    const [menus, setMenus] = useState<MenuItemType[]>([])


    useEffect(() => {
        setActiveKeys([location.pathname])
    }, [location])


    useEffect(() => {
        const _menus = routerConfig.map(item => (
            {
                key: item.path,
                label: <NavLink key={item.path} to={item.path as string}>{item.name}</NavLink>,
            }
        ))
        setMenus(_menus as MenuItemType[])
    }, [])

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Menu
                    mode="horizontal"
                    selectedKeys={activeKeys}
                    multiple={false}
                    items={menus}
                    style={{ flex: 1, minWidth: 0 }}
                />

                <SearchBar />
                <AvatarCustom />
            </Header>
            <Content>
                <Outlet />
            </Content>
        </Layout>

    )
}

export default HeaderCustom

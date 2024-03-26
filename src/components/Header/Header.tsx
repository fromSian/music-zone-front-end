import { Layout, Menu } from 'antd'
import { Content } from 'antd/es/layout/layout'
import type { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { useEffect, useState } from 'react'
import type { RouteObject } from 'react-router-dom'
import { NavLink, Outlet } from 'react-router-dom'

const { Header } = Layout
interface HeaderProps {
    routerConfig: (RouteObject & { name: string })[]
}

const HeaderCustom = ({ routerConfig }: HeaderProps) => {


    const [menus, setMenus] = useState<MenuItemType[]>([])


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
                    theme='dark'
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={menus}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content>
                <Outlet />
            </Content>
        </Layout>

    )
}

export default HeaderCustom

import React from 'react'
import type { RouteObject, Router } from 'react-router-dom'
import { Outlet, NavLink } from 'react-router-dom'
import styles from './index.module.less'

interface HeaderProps {
    routerConfig: (RouteObject & { name: string })[]
}

const Header = ({ routerConfig }: HeaderProps) => {


    return (
        <nav>
            {
                routerConfig.map(item => {
                    return <NavLink className={styles.link} key={item.path} to={item.path as string}>{item.name}</NavLink>
                })
            }
            <Outlet />
        </nav>
    )
}

export default Header

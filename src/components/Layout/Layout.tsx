import { Layout, Menu } from "antd";
import type { MenuItemType } from "antd/es/menu/hooks/useItems";
import { useEffect, useState } from "react";
import type { RouteObject } from "react-router-dom";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Playbar from "../Playbar/Playbar";
import SearchBar from "./Search";

const { Header, Content, Footer } = Layout;
interface HeaderProps {
  routerConfig: (RouteObject & { name: string; isMenu: boolean })[];
}

const HeaderCustom = ({ routerConfig }: HeaderProps) => {
  const location = useLocation();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [menus, setMenus] = useState<MenuItemType[]>([]);

  useEffect(() => {
    setActiveKeys([location.pathname]);
  }, [location]);

  useEffect(() => {
    const _menus = routerConfig
      .filter((item) => item.isMenu)
      .map((item) => ({
        key: item.path,
        label: (
          <NavLink key={item.path} to={item.path as string}>
            {item.name}
          </NavLink>
        ),
      }));
    setMenus(_menus as MenuItemType[]);
  }, []);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Menu
          mode="horizontal"
          selectedKeys={activeKeys}
          multiple={false}
          items={menus}
          style={{ flex: 1, minWidth: 0 }}
        />

        <SearchBar />
        {/* <AvatarCustom /> */}
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer>
        <Playbar />
      </Footer>
    </Layout>
  );
};

export default HeaderCustom;

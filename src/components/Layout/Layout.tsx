import { useAppDispatch } from "@/states/hooks";
import { setPlaylistId } from "@/states/loves.slice";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
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
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [activeKeys, setActiveKeys] = useState<string[]>(["/"]);
  const [menus, setMenus] = useState<MenuItemType[]>([]);

  useEffect(() => {
    const reResult = /^\/([a-z,A-Z,0-9]+)/.exec(location.pathname);
    setActiveKeys(reResult ? [reResult[0]] : ["/"]);
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

  useEffect(() => {
    const queryLove = async () => {
      try {
        const res = await request.get("/get_love_playlist/");
        if (res && res.data) {
          dispatch(setPlaylistId(res.data.id));
        }
      } catch (error) {
        getErrorMessage(error);
      }
    };
    queryLove();
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

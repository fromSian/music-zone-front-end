import Loading from "@/components/loading/Loading";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Layout/Layout";
import store from "./states/store";
const lazyLoad = (name: string) => {
  const Module = lazy(async () => import(`./pages/${name}.tsx`));
  return (
    <Suspense fallback={<Loading />}>
      <Module />
    </Suspense>
  );
};

const routerConfig = [
  {
    name: "首頁",
    path: "/",
    isMenu: true,
    element: lazyLoad("Home"),
  },
  {
    name: "排行榜",
    path: "/rank",
    isMenu: true,
    element: lazyLoad("Rank"),
  },
  {
    name: "音乐库",
    path: "/library",
    isMenu: true,
    children: [
      {
        name: "专辑信息",
        path: "/library/albums/:id",
        isMenu: false,
        element: lazyLoad("AlbumInfo"),
        children: [
          {
            name: "专辑信息",
            path: "/library/albums/:id/:song_id",
            isMenu: false,
            element: lazyLoad("AlbumInfo"),
          },
        ],
      },
      {
        name: "歌单",
        path: "/library/playlists/:id",
        isMenu: false,
        element: lazyLoad("AlbumInfo"),
      },
      {
        name: "artist",
        path: "/library/artists/:id",
        isMenu: false,
        element: lazyLoad("AlbumInfo"),
      },
      {
        name: "音乐库",
        path: "/library/:type",
        isMenu: true,
        element: lazyLoad("Library"),
      },
      {
        name: "音乐库",
        path: "/library",
        isMenu: true,
        element: lazyLoad("Library"),
      },
    ],
  },
  {
    name: "個人信息",
    path: "/userinfo",
    isMenu: false,
    element: lazyLoad("UserInfo"),
    children: [
      {
        name: "個人信息",
        path: "/userinfo/:id",
        element: lazyLoad("UserInfo"),
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header routerConfig={routerConfig} />,
    children: routerConfig,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorBgBase: "#cddec6",
          colorTextBase: "#181515",
          colorPrimary: "#4A5589",
          colorInfo: "#4A5589",
          colorSuccess: "#3c6e24",
          colorWarning: "#a47d2e",
          colorError: "#a33132",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </ConfigProvider>
  </Provider>
  // </React.StrictMode>
);

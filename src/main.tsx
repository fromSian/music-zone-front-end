import Loading from "@/components/loading/Loading";
import { ConfigProvider } from "antd";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
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
    element: lazyLoad("Home"),
  },
  {
    name: "排行榜",
    path: "/rank",
    element: lazyLoad("Rank"),
  },
  {
    name: "個人信息",
    path: "/userinfo",
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
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
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

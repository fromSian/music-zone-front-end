import Loading from '@/components/loading/Loading'
import { ConfigProvider } from 'antd'
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Header from './components/Header/Header'

const lazyLoad = (name: string) => {
  const Module = lazy(async () => import(`./pages/${name}.tsx`))
  return <Suspense fallback={<Loading />}><Module /></Suspense>
}

const routerConfig = [
  {
    name: '首頁',
    path: '/',
    element: lazyLoad('Home')
  },
  {
    name: '排行榜',
    path: '/rank',
    element: lazyLoad('Rank'),
  },
  {
    name: '個人信息',
    path: '/userinfo',
    element: lazyLoad('UserInfo'),
    children: [
      {
        name: '個人信息',
        path: '/userinfo/:id',
        element: lazyLoad('UserInfo')
      }
    ]
  }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header routerConfig={routerConfig} />,
    children: routerConfig,
  }
])


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={{
      token: {
        "colorBgBase": "#36393b",
        "colorTextBase": "#f6ffed",
        "colorPrimary": "#4096ff",
        "colorInfo": "#4096ff",
        "colorSuccess": "#389e0d",
        "colorWarning": "#ad6800",
        "colorError": "#ff4d4f",
        "wireframe": true
      }
    }}>
      <RouterProvider router={router}>
      </RouterProvider>
    </ConfigProvider>
  </React.StrictMode>,
)

// main.tsx
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ProductsPage from './pages/ProductsPage'
import ReduxProductsPage from './pages/ReduxProductPage'
import store from './app/store'
import { Provider } from 'react-redux'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'productPage', element: <ProductsPage /> },
      { path: '/reduxProductPage', element: <ReduxProductsPage /> },
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

)
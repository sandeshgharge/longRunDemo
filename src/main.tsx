// main.tsx
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ProductsPage from './pages/ProductsPage'


const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />, 
    children: [{ path: 'productPage', element: <ProductsPage /> }] 
  },
])

createRoot(document.getElementById('root')!).render(

    <RouterProvider router={router} />

)
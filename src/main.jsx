import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Layout from './Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Account from './pages/Account'
import Chat from './pages/Chat'
import Categories from './pages/Categories'
import FindYourSize from './pages/FindYourSize'
import SizeGuide from './pages/SizeGuide'
import UploadProduct from './pages/UploadProduct'
import AdminDashboard from './pages/AdminDashboard'
import { createPageUrl } from './utils'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={createPageUrl('Home')} element={<Layout><Home /></Layout>} />
          <Route path={createPageUrl('Catalog')} element={<Layout><Catalog /></Layout>} />
          <Route path={createPageUrl('ProductDetail')} element={<Layout><ProductDetail /></Layout>} />
          <Route path={createPageUrl('Cart')} element={<Layout><Cart /></Layout>} />
          <Route path={createPageUrl('Checkout')} element={<Layout><Checkout /></Layout>} />
          <Route path={createPageUrl('Payment')} element={<Layout><Payment /></Layout>} />
          <Route path={createPageUrl('Orders')} element={<Layout><Orders /></Layout>} />
          <Route path={createPageUrl('OrderDetail')} element={<Layout><OrderDetail /></Layout>} />
          <Route path={createPageUrl('Account')} element={<Layout><Account /></Layout>} />
          <Route path={createPageUrl('Chat')} element={<Layout><Chat /></Layout>} />
          <Route path={createPageUrl('Categories')} element={<Layout><Categories /></Layout>} />
          <Route path={createPageUrl('FindYourSize')} element={<Layout><FindYourSize /></Layout>} />
          <Route path={createPageUrl('SizeGuide')} element={<Layout><SizeGuide /></Layout>} />
          <Route path={createPageUrl('UploadProduct')} element={<Layout><UploadProduct /></Layout>} />
          <Route path={createPageUrl('AdminDashboard')} element={<AdminDashboard />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)


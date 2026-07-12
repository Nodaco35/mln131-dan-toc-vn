import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import EthnicList from './pages/EthnicList'
import EthnicDetail from './pages/EthnicDetail'
import AdminLayout from './pages/admin/AdminLayout'
import AdminList from './pages/admin/AdminList'
import AdminDetail from './pages/admin/AdminDetail'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<EthnicList />} />
      <Route path="/dan-toc/:id" element={<EthnicDetail />} />
      
      {/* Admin Routes */}
      <Route path="/admin-mln131-setting" element={<AdminProvider><AdminLayout /></AdminProvider>}>
        <Route index element={<AdminList />} />
        <Route path="edit/:id" element={<AdminDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

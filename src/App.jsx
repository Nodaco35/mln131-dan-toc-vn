import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import EthnicList from './pages/EthnicList'
import EthnicDetail from './pages/EthnicDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EthnicList />} />
      <Route path="/dan-toc/:id" element={<EthnicDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

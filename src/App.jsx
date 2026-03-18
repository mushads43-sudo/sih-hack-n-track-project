import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import LiveSimulation from './pages/LiveSimulation'
import WhatIfAnalysis from './pages/WhatIfAnalysis'
import AIRecommendations from './pages/AIRecommendations'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulation" element={<LiveSimulation />} />
          <Route path="/what-if" element={<WhatIfAnalysis />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

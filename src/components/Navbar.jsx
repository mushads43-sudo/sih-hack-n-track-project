import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Play, Lightbulb, Brain, Train } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/simulation', label: 'Live Simulation', icon: Play },
    { path: '/what-if', label: 'What-If Analysis', icon: Lightbulb },
    { path: '/ai-recommendations', label: 'AI Recommendations', icon: Brain },
  ]

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Train className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">
                RailOptix
              </span>
            </div>
          </div>
          
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-900/20'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

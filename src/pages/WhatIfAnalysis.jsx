import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Calculator, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

const WhatIfAnalysis = () => {
  const [scenarios, setScenarios] = useState({
    current: {
      name: 'Current Operations',
      throughput: 45,
      averageDelay: 1.8,
      utilization: 82,
      onTime: 87,
      cost: 120000,
      activeTrains: 15,
      tracks: 5
    },
    optimized: {
      name: 'AI Optimized',
      throughput: 52,
      averageDelay: 1.1,
      utilization: 88,
      onTime: 94,
      cost: 95000,
      activeTrains: 15,
      tracks: 5
    },
    vip: {
      name: 'VIP Train Scenario',
      throughput: 48,
      averageDelay: 2.2,
      utilization: 85,
      onTime: 82,
      cost: 135000,
      activeTrains: 16,
      tracks: 5
    },
    washout: {
      name: 'Track Washout',
      throughput: 38,
      averageDelay: 3.5,
      utilization: 75,
      onTime: 75,
      cost: 150000,
      activeTrains: 15,
      tracks: 5
    },
    badweather: {
      name: 'Bad Weather',
      throughput: 32,
      averageDelay: 4.2,
      utilization: 68,
      onTime: 70,
      cost: 180000,
      activeTrains: 15,
      tracks: 4
    }
  })

  const [selectedScenario, setSelectedScenario] = useState('current')
  const [comparisonData, setComparisonData] = useState([])
  const [customInputs, setCustomInputs] = useState({
    selectedTrain: '',
    delayMinutes: 0,
    selectedTrack: '',
    trackBusy: false
  })
  const [simulationResults, setSimulationResults] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    const data = Object.entries(scenarios).map(([key, scenario]) => ({
      name: scenario.name,
      throughput: scenario.throughput,
      delay: scenario.averageDelay,
      utilization: scenario.utilization,
      onTime: scenario.onTime,
      cost: scenario.cost / 1000
    }))
    setComparisonData(data)
  }, [scenarios])

  const currentScenario = scenarios[selectedScenario]

  // Train options for simulation
  const trainOptions = [
    'Express 101', 'Express 102', 'Express 103', 'Express 104', 'Express 105', 'Express 106', 'Express 107',
    'Local 201', 'Local 202', 'Local 203', 'Local 204', 'Local 205',
    'Freight 301', 'Freight 302', 'Freight 303', 'VIP 001'
  ]

  // Track options for simulation
  const trackOptions = ['Track 1', 'Track 2', 'Track 3', 'Track 4', 'Track 5']

  // Simulate custom scenario
  const runCustomSimulation = () => {
    setIsSimulating(true)
    
    // Simulate processing time
    setTimeout(() => {
      const baseScenario = scenarios.current
      let modifiedScenario = { ...baseScenario }
      
      // Apply train delay
      if (customInputs.selectedTrain && customInputs.delayMinutes > 0) {
        modifiedScenario.averageDelay += customInputs.delayMinutes * 0.5 // Scale factor
        modifiedScenario.onTime = Math.max(60, modifiedScenario.onTime - (customInputs.delayMinutes * 2))
        modifiedScenario.throughput = Math.max(20, modifiedScenario.throughput - (customInputs.delayMinutes * 0.5))
      }
      
      // Apply track busy
      if (customInputs.selectedTrack && customInputs.trackBusy) {
        modifiedScenario.utilization = Math.min(95, modifiedScenario.utilization + 15)
        modifiedScenario.averageDelay += 1.2
        modifiedScenario.throughput = Math.max(25, modifiedScenario.throughput - 8)
        modifiedScenario.onTime = Math.max(65, modifiedScenario.onTime - 8)
      }
      
      setSimulationResults({
        before: baseScenario,
        after: modifiedScenario,
        changes: {
          throughputChange: modifiedScenario.throughput - baseScenario.throughput,
          delayChange: modifiedScenario.averageDelay - baseScenario.averageDelay,
          utilizationChange: modifiedScenario.utilization - baseScenario.utilization,
          onTimeChange: modifiedScenario.onTime - baseScenario.onTime
        }
      })
      setIsSimulating(false)
    }, 1500)
  }

  const timeSeriesData = [
    { time: '00:00', current: 8, optimized: 10, vip: 9, washout: 6, badweather: 5 },
    { time: '04:00', current: 5, optimized: 7, vip: 6, washout: 4, badweather: 3 },
    { time: '08:00', current: 42, optimized: 48, vip: 45, washout: 35, badweather: 30 },
    { time: '12:00', current: 48, optimized: 55, vip: 52, washout: 40, badweather: 35 },
    { time: '16:00', current: 45, optimized: 52, vip: 48, washout: 38, badweather: 32 },
    { time: '20:00', current: 32, optimized: 38, vip: 35, washout: 28, badweather: 25 },
    { time: '24:00', current: 12, optimized: 15, vip: 13, washout: 10, badweather: 8 }
  ]

  const impactData = [
    { metric: 'Throughput', current: currentScenario.throughput, optimized: scenarios.optimized.throughput, improvement: ((scenarios.optimized.throughput - currentScenario.throughput) / currentScenario.throughput * 100) },
    { metric: 'Delay Reduction', current: currentScenario.averageDelay, optimized: scenarios.optimized.averageDelay, improvement: ((currentScenario.averageDelay - scenarios.optimized.averageDelay) / currentScenario.averageDelay * 100) },
    { metric: 'Utilization', current: currentScenario.utilization, optimized: scenarios.optimized.utilization, improvement: ((scenarios.optimized.utilization - currentScenario.utilization) / currentScenario.utilization * 100) },
    { metric: 'On-Time %', current: currentScenario.onTime, optimized: scenarios.optimized.onTime, improvement: ((scenarios.optimized.onTime - currentScenario.onTime) / currentScenario.onTime * 100) }
  ]

  const MetricCard = ({ title, value, icon: Icon, color, suffix = '', improvement = null }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-300">{title}</p>
            <p className="text-2xl font-semibold text-white">
              {value}{suffix}
            </p>
          </div>
        </div>
        {improvement !== null && (
          <div className={`text-sm font-medium ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )

  const ScenarioCard = ({ scenarioKey, scenario, isSelected, onClick }) => (
    <div
      onClick={() => onClick(scenarioKey)}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[200px] ${
        isSelected
          ? 'border-blue-500 bg-blue-900/20'
          : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
      }`}
    >
      <h3 className="text-base font-semibold text-white mb-3 leading-tight">{scenario.name}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex flex-col">
          <span className="text-slate-300 text-xs">Throughput:</span>
          <span className="font-medium text-white text-sm">{scenario.throughput} trains/hr</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-300 text-xs">Avg Delay:</span>
          <span className="font-medium text-white text-sm">{scenario.averageDelay} min</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-300 text-xs">Utilization:</span>
          <span className="font-medium text-white text-sm">{scenario.utilization}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-300 text-xs">On-Time:</span>
          <span className="font-medium text-white text-sm">{scenario.onTime}%</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-white mb-8">
          What-If Analysis
        </h1>

        {/* Scenario Selection */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Scenario Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {Object.entries(scenarios).map(([key, scenario]) => (
              <ScenarioCard
                key={key}
                scenarioKey={key}
                scenario={scenario}
                isSelected={selectedScenario === key}
                onClick={setSelectedScenario}
              />
            ))}
          </div>
        </div>

        {/* Custom Simulation Input */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">Custom Scenario Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Train</label>
              <select
                value={customInputs.selectedTrain}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, selectedTrain: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a train...</option>
                {trainOptions.map(train => (
                  <option key={train} value={train}>{train}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Delay (minutes)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={customInputs.delayMinutes}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, delayMinutes: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Track</label>
              <select
                value={customInputs.selectedTrack}
                onChange={(e) => setCustomInputs(prev => ({ ...prev, selectedTrack: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a track...</option>
                {trackOptions.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>
            
            {/* <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customInputs.trackBusy}
                  onChange={(e) => setCustomInputs(prev => ({ ...prev, trackBusy: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-300">Track Busy</span>
              </label>
            </div> */}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={runCustomSimulation}
              disabled={isSimulating}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Simulation Results */}
        {simulationResults && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Simulation Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Before vs After Comparison</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-300">Throughput</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">{simulationResults.before.throughput} → {simulationResults.after.throughput}</span>
                      <span className={`text-sm font-medium ${simulationResults.changes.throughputChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {simulationResults.changes.throughputChange >= 0 ? '+' : ''}{simulationResults.changes.throughputChange.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-300">Average Delay</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">{simulationResults.before.averageDelay} → {simulationResults.after.averageDelay}</span>
                      <span className={`text-sm font-medium ${simulationResults.changes.delayChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {simulationResults.changes.delayChange >= 0 ? '+' : ''}{simulationResults.changes.delayChange.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-300">Utilization</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">{simulationResults.before.utilization}% → {simulationResults.after.utilization}%</span>
                      <span className={`text-sm font-medium ${simulationResults.changes.utilizationChange >= 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {simulationResults.changes.utilizationChange >= 0 ? '+' : ''}{simulationResults.changes.utilizationChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-300">On-Time Performance</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">{simulationResults.before.onTime}% → {simulationResults.after.onTime}%</span>
                      <span className={`text-sm font-medium ${simulationResults.changes.onTimeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {simulationResults.changes.onTimeChange >= 0 ? '+' : ''}{simulationResults.changes.onTimeChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Impact Summary</h3>
                <div className="space-y-3">
                  {customInputs.selectedTrain && customInputs.delayMinutes > 0 && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-sm text-red-300">
                          {customInputs.selectedTrain} delayed by {customInputs.delayMinutes} minutes
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {customInputs.selectedTrack && customInputs.trackBusy && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm text-yellow-300">
                          {customInputs.selectedTrack} is busy
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-slate-700 rounded-lg">
                    <div className="text-sm text-slate-300">
                      <strong>Total Impact:</strong> {simulationResults.changes.throughputChange < 0 ? 'Decreased' : 'Increased'} throughput by {Math.abs(simulationResults.changes.throughputChange).toFixed(1)} trains/hour
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Scenario Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Throughput"
            value={currentScenario.throughput}
            icon={TrendingUp}
            color="bg-railway-green"
            suffix=" trains/hr"
            improvement={selectedScenario !== 'current' ? impactData[0].improvement : null}
          />
          <MetricCard
            title="Average Delay"
            value={currentScenario.averageDelay}
            icon={Clock}
            color="bg-railway-yellow"
            suffix=" min"
            improvement={selectedScenario !== 'current' ? impactData[1].improvement : null}
          />
          <MetricCard
            title="Track Utilization"
            value={currentScenario.utilization}
            icon={Calculator}
            color="bg-railway-blue"
            suffix="%"
            improvement={selectedScenario !== 'current' ? impactData[2].improvement : null}
          />
          <MetricCard
            title="On-Time Performance"
            value={currentScenario.onTime}
            icon={CheckCircle}
            color="bg-railway-green"
            suffix="%"
            improvement={selectedScenario !== 'current' ? impactData[3].improvement : null}
          />
        </div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Throughput Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#cbd5e1' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="throughput" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Delay Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#cbd5e1' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="delay" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Series Analysis */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Throughput Over Time - All Scenarios
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" tick={{ fill: '#cbd5e1' }} />
              <YAxis tick={{ fill: '#cbd5e1' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  color: '#f1f5f9'
                }} 
              />
              <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} name="Current" />
              <Line type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={2} name="AI Optimized" />
              <Line type="monotone" dataKey="vip" stroke="#ef4444" strokeWidth={2} name="VIP Train" />
              <Line type="monotone" dataKey="washout" stroke="#f59e0b" strokeWidth={2} name="Track Washout" />
              <Line type="monotone" dataKey="badweather" stroke="#6b7280" strokeWidth={2} name="Bad Weather" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Analysis */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Impact Analysis: Current vs AI Optimized
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Performance Improvements</h4>
              <div className="space-y-3">
                {impactData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-300">{item.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">
                        {item.current} → {item.optimized}
                      </span>
                      <span className={`text-sm font-medium ${item.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.improvement > 0 ? '+' : ''}{item.improvement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Cost Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm font-medium text-slate-300">Current Cost</span>
                  <span className="text-sm font-medium text-white">${scenarios.current.cost.toLocaleString()}/month</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm font-medium text-slate-300">Optimized Cost</span>
                  <span className="text-sm font-medium text-white">${scenarios.optimized.cost.toLocaleString()}/month</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                  <span className="text-sm font-medium text-slate-300">Savings</span>
                  <span className="text-sm font-medium text-green-400">
                    ${(scenarios.current.cost - scenarios.optimized.cost).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatIfAnalysis
